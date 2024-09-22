const prisma = require('../prisma/prisma');
const bcrypt = require('bcrypt');
const { createId } = require('@paralleldrive/cuid2');

const mailService = require('./mail-service');
const tokenService = require('./token-service');

const UserDto = require('../dtos/user-dto');
const LinkDto = require('../dtos/link-dto');

const ApiError = require('../exceptions/api-error');
const cuid2 = require('@paralleldrive/cuid2');
const linkService = require('./link-service');

class UserService {
    async registration(email, password) {
        const candidate = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if (candidate) {
            throw ApiError.BadRequest("Пользователь с таким email уже существует");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationLink = createId();
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                activationLink: activationLink
            }
        });

        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        }
    }

    async activate(activationLink) {
        const user = await prisma.user.findUnique({
            where: {
                activationLink: activationLink
            }
        });

        if (!user) {
            throw ApiError.BadRequest("Некорректная ссылка активации.");
        }

        else {
            return prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    isActivated: true
                }
            })
        }
    }

    async login(email, password) {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if (!user) {
            throw ApiError.BadRequest("Пользователь не найден");
        }

        const isPasswdEqual = await bcrypt.compare(password, user.password);

        if (!isPasswdEqual) {
            throw ApiError.BadRequest("Неверный пароль");
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        console.log(userData, tokenFromDb);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userData.id
            }
        });

        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        }
    }

    async requestPasswordReset(email) {
        const user = await prisma.user.findUnique({
            where: {
                email
            }, include: {
                resetToken: true,
            }
        });

        if (!user) {
            throw ApiError.BadRequest("Пользователь не найден");
        }

        if (user.resetToken) {
            await prisma.resetToken.delete({
                where: {
                    id: user.resetToken.id,
                }
            });
        }

        const randSeed = createId();
        const hash = await bcrypt.hash(randSeed, 10);

        const resetToken = await prisma.resetToken.create({
            data: {
                resetToken: hash,
                userId: user.id,
                // 24 часа
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });

        await mailService.sendResetMail(email, `${process.env.CLIENT_URL}/passwordReset?token=${resetToken.resetToken}&id=${resetToken.userId}`);
    }

    async passwordReset(userId, token, password) {
        const passwordResetToken = await prisma.resetToken.findUnique({
            where: {
                resetToken: token
            }
        });

        if (!passwordResetToken) {
            throw ApiError.BadRequest("Bad token");
        }

        const isValid = (token === passwordResetToken.resetToken);
        if (!isValid) {
            throw ApiError.BadRequest("Bad token");
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                resetToken: true
            }
        })

        if (user?.resetToken.expiresAt < Date.now()) {
            throw ApiError.BadRequest("Bad token");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(hashedPassword);

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedPassword
            }
        });

        await prisma.resetToken.delete({
            where: {
                resetToken: token
            }
        });

        const userDto = new UserDto(user);

        return {
            user: userDto
        }
    }

    async getLinks(user, cursor, take = 10) {
        const skipCount = (parseInt(cursor) === 0) ? 0 : (cursor * take - 1);
        const result = await prisma.shortenedLink.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                authorId: user.id,
            },
            skip: skipCount,
            take: take,
        });

        if (!result) {
            throw ApiError.BadRequest("Ссылок не найдено");
        }

        const isEnded = (take !== result.length);

        const linksDto = result.map(
            (el) => {const linkDto = new LinkDto(el);
                linkDto.short = `${process.env.REDIRECT_URL}/${linkDto.shortened}`;
                return linkDto;
            }

            );

        return { 
            links: linksDto, 
            isEnded: isEnded 
        };
    }

    async createLink(user, link) {
        const result = await linkService.createLink(user, link);
        const linkDto = new LinkDto(result);
        return {link: linkDto};
    }
}

module.exports = new UserService();