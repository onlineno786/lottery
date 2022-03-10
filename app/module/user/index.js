const Passport          = require('passport');
const constant          = require(__basePath + 'app/core/constant');
const router            = require('express').Router({
    caseSensitive       : true,
    strict              : true
});
const userValidator     = require(constant.path.module + 'user/user.validator.js');
const userController    = require(constant.path.module + 'user/user.controller');

const AdminGuard        = Passport.authenticate(['admin'], { session : false })
const UserGuard         = Passport.authenticate(['user'], { session : false });
const Guard             = Passport.authenticate(['user', 'admin'], { session : false });

/* User Routes */ 
router.post(
    '/',
    AdminGuard,
    userValidator.addUser,
    userController.user
);

router.get(
    '/',
    AdminGuard,
    userController.getAll
);

router.get(
    '/me',
    Guard,
    userController.me
);

router.patch(
    '/',
    UserGuard,
    userController.update
);

/* Authentication Routes */
router.post(
    '/login',
    userController.login
);

router.post(
    '/register',
    userController.register
);

// * User Media */
router.post(
    '/media',
    userController.media
);

module.exports = {
    router: router
};