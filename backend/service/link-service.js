const { init } = require('@paralleldrive/cuid2');
const prisma = require('../prisma/prisma');
const ApiError = require('../exceptions/api-error');

class LinkService {
    async createLink(user, link) {
        // создать cuid с длиной 8
        const shortId = init({ length: 8 })();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const candidate = await prisma.shortenedLink.findUnique({
            where: {
                authorId_full: {
                    authorId: user.id,
                    full: link
                }
            }
        });

        if(candidate) {
            return candidate;
        }

        return await prisma.shortenedLink.create({
            data: {
                shortened: shortId,
                full: link,
                expiresAt: expiresAt,
                authorId: user.id
            }
        });
    }

    async getLink(shortLink) {
        console.log(shortLink);
        const result = await prisma.shortenedLink.findUnique({
            where: {
                shortened: shortLink,
            }
        })

        if(!result) {
            throw ApiError.BadRequest("Ссылка не найдена");
        }

        if(result.expiresAt < Date.now()) {
            throw ApiError.BadRequest("Ссылка испорчена");
        }

        return result;
    }

    async getAndIncrementLink(shortLink) {
        const result = await prisma.shortenedLink.findUnique({
            where: {
                shortened: shortLink,
            }
        });
        if(!result) {
            throw ApiError.BadRequest("Ссылка не найдена");
        }

        if(result.expiresAt < Date.now()) {
            throw ApiError.BadRequest("Ссылка испорчена");
        }

        await prisma.shortenedLink.update({
            where: {
                shortened: shortLink,
            },
            data: {
                clickCount: result.clickCount + 1,
            }
        })

        return result;
    }
}

module.exports = new LinkService();