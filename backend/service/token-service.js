const jwt = require('jsonwebtoken');
const prisma = require('../prisma/prisma');

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        }
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await prisma.token.findUnique({
            where: {
                userId
            }
        });

        if (tokenData) {
            return await prisma.token.update({
                where: {
                    id: tokenData.id,
                },
                data: {
                    refreshToken: refreshToken
                }
            });
        }

        else {
            return await prisma.token.create({
                data: {
                    userId,
                    refreshToken: refreshToken
                }
            });
        }
    }

    async removeToken(refreshToken) {
        const tokenData = await prisma.token.delete({where: {
            refreshToken
        }});
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await prisma.token.findUnique({where: {
            refreshToken: refreshToken
        }});
        return tokenData;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);            
            return userData;
        }
        catch(e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        }
        catch(e) {
            return null;
        }
    }


}

module.exports = new TokenService();