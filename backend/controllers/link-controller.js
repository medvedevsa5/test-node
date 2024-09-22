const linkService = require("../service/link-service");
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class LinkController {
    async redirectTo(req, res, next) {
        try {
            const link = req.params.shortlink;
            const { full } = await linkService.getAndIncrementLink(link);
            return res.redirect(full);
        } catch (e) {
            next(e);
        }
    }

    async getFullLink(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Ошибка при валидации", errors.array()));
            }
            const { link } = req.query;
            const shortened = link.replace(process.env.REDIRECT_URL + '/', "");
            const { full } = await linkService.getLink(shortened);
            return res.json(full);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new LinkController();