const Router = require('express');
const router = Router();

const userController = require('../controllers/user-controller');

const { body, query } = require('express-validator');

const authMiddleware = require('../middleware/auth-middleware');
const linkController = require('../controllers/link-controller');

router.get('/re/:shortlink', linkController.redirectTo);
router.get('/ac', query('link').isURL({ require_protocol: true, 
    require_tld: false, 
    host_whitelist: ['localhost'] }), 
    linkController.getFullLink);

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    userController.registration);

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);

router.post('/request-reset',
    body('email').isEmail(),
    userController.requestPasswordReset);

router.post('/resetpw',
    body('userId').notEmpty(),
    body('password').isLength({ min: 3, max: 32 }),
    body('token').notEmpty(),
    userController.resetPassword);

router.get('/refresh', userController.refresh);

router.get('/links', authMiddleware, query('cursor').isInt({ min: 0 }).notEmpty(), userController.links);

router.post('/links', authMiddleware,
    body('link').isURL({ require_protocol: true }),
    userController.genLink
);

module.exports = router;
