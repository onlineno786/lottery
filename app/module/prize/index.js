const Passport          = require('passport');
const constant          = require(__basePath + 'app/core/constant');
const router            = require('express').Router({
    caseSensitive       : true,
    strict              : true
});
const prizeController    = require(constant.path.module + 'prize/prize.controller');

const AdminGuard        = Passport.authenticate(['admin'], { session : false })
const Guard             = Passport.authenticate(['user', 'admin'], { session : false });

/* prize Routes */ 
router.post(
    '/',
    AdminGuard,
    prizeController.prize
);

router.get(
    '/',
    Guard,
    prizeController.getAll
);

router.post(
    '/:prizeId/purchase',
    Guard,
    prizeController.purchase
);

router.get(
    '/purchases',
    Guard,
    prizeController.purchases
);

module.exports = {
    router: router
};