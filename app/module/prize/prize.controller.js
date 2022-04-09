const constant          = require(__basePath + 'app/core/constant');
const config            = require(constant.path.app + 'config/index.js');
const response          = require(constant.path.app + 'util/response');
const errorHelper       = require(constant.path.app + 'util/errorHelper');
const messages          = require(constant.path.app + 'core/response')
const prizeService      = require(constant.path.app + 'module/prize/prize.service');
const underscore        = require('underscore');
const Utility           = require(constant.path.app + 'util/utility.js');
const Razorpay          = require('razorpay');
const crypto            = require('crypto');

const instance          = new Razorpay({
    key_id              : process.env.RAZOR_PAY_KEY_ID,
    key_secret          : process.env.RAZOR_PAY_KEY_SECRET,
});

exports.prize           = (req, res) => {
    const body          = req.body;
    
    const payload       = {
        'name'          : body.name,
        'price'         : body.price,
        'prizes'        : Object.values(body.prizes)
    }

    prizeService.createPrize(payload, (error, result) => {
        if(error) {
            return res.status(400).json(response.build('ERROR', 
                errorHelper.parseError(error) 
            ));  
        }
        return res.status(200).json(response.build('SUCCESS', { "data" : result }));
    })
}

exports.getAll          = (req, res) => {
    let query           = {};

    if(req.query.prizeId) {
        query           = { _id : Utility.toObjectId(req.query.prizeId) }
    }

    if(req.query.history) {
        query['history'] = true;
    } else {
        query['history'] = false;
    }

    if(req.query.prizeId) {
        // get all registered prizes
        prizeService.getPrize(req.user, query, (error, result) => {
            if(error) {
                return res.status(400).json(response.build('ERROR', 
                    errorHelper.parseError(error) 
                ));  
            }
            return res.status(200).json(response.build('SUCCESS', { "data" : result }));
        })
    } else {
        // get all registered prizes
        prizeService.getPrizes(query, (error, result) => {
            if(error) {
                return res.status(400).json(response.build('ERROR', 
                    errorHelper.parseError(error) 
                ));  
            }
            return res.status(200).json(response.build('SUCCESS', { "data" : result }));
        })
    }
}

exports.purchase        = (req, res) => {
    const {
        prizeId
    }                   = req.params;

    // get all registered prizes
    prizeService.getPrizes({ _id : Utility.toObjectId(prizeId) }, (error, result) => {
        if(error) {
            return res.status(400).json(response.build('ERROR', 
                errorHelper.parseError(error) 
            ));  
        }

        const prize     = underscore.first(result);

        prizeService.getSubscriptions({ prizeId : Utility.toObjectId(prizeId) }, (error, result) => {
            if(error) {
                return res.status(400).json(response.build('ERROR', 
                    errorHelper.parseError(error) 
                ));  
            }
            const subscription = result.filter((subs) => {
                return subs.userId.toString() == req.user._id.toString();
            });

            if(underscore.isEmpty(subscription)) {
                if(prize.price === 0) {
                    const subscription  = {
                        'prizeId'       : Utility.toObjectId(prizeId),
                        'userId'        : req.user._id,
                        'price'         : prize.price,
                        'code'          : (1000 + result.length)
                    }
    
                    prizeService.createSubscription(subscription, (error, result) => {
                        if(error) {
                            return res.status(400).json(response.build('ERROR', 
                                errorHelper.parseError(error) 
                            ));  
                        }
                        return res.status(200).json(response.build('SUCCESS', { "data" : result }));
                    });    
                } else {
                    const options       = {
                        amount          : prize.price * 100,
                        currency        : 'INR',
                        receipt         : 'Dreamfull-fill Payment',
                        payment_capture : 1
                    }

                    instance.orders.create(options, (error, result) => {
                        if(error) {
                            return res.status(400).json(response.build('ERROR', 
                                errorHelper.parseError('Something went wrong while initiating payment...') 
                            ));  
                        } 
                        return res.status(200).json(response.build('SUCCESS', { "data" : { ...result, razorpay : true }}));

                    });
                }
            } else {
                return res.status(400).json(response.build('SUCCESS', { "message" : 'You have already purchased! enjoy!', subscription }));
            }
        })
    })
}

exports.capture         = (req, res) => {
    let {
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        amount
    }                   = req.body;
    let {
        prizeId
    }                   = req.params;

    const shasum = crypto.createHmac("sha256", process.env.RAZOR_PAY_KEY_SECRET);

    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    if(digest === razorpaySignature) {

        prizeService.getSubscriptions({ prizeId : Utility.toObjectId(prizeId) }, (error, result) => {
            if(error) {
                return res.status(400).json(response.build('ERROR', 
                    errorHelper.parseError(error) 
                ));  
            }
            const subscription  = {
                'prizeId'       : Utility.toObjectId(prizeId),
                'userId'        : req.user._id,
                'price'         : amount,
                'code'          : (1000 + result.length),
                'orderId'       : razorpayOrderId,
            }

            prizeService.createSubscription(subscription, (error, result) => {
                if(error) {
                    return res.status(400).json(response.build('ERROR', 
                        errorHelper.parseError(error) 
                    ));  
                }
                return res.status(200).json(response.build('SUCCESS', { "data" : result }));
            }); 
        });
    } else {
        if(error) {
            return res.status(400).json(response.build('ERROR', 
                errorHelper.parseError('Payment failed, please try again later...') 
            ));  
        } 
    }

}

exports.purchases       = (req, res) => {
    const {
        purchaseId
    }                   = req.query;

    let query           = { userId : req.user._id };

    if(req.query.purchaseId) {
        query           = underscore.extend(query, { _id : Utility.toObjectId(purchaseId) })
    }
    
    // get all registered prizes
    prizeService.getSubscriptions(query, (error, result) => {
        if(error) {
            return res.status(400).json(response.build('ERROR', 
                errorHelper.parseError(error) 
            ));  
        }
        return res.status(200).json(response.build('SUCCESS', { "data" : result }));

    })
}

exports.updatePrize     = (req, res) => {
    const {
        prizeId
    }                   = req.params;
    const body          = req.body;

    prizeService.updatePrize(prizeId, body, (error, result) => {
        if(error) {
            return res.status(400).json(response.build('ERROR', 
                errorHelper.parseError(error) 
            ));  
        }
        return res.status(200).json(response.build('SUCCESS', { "data" : result }));
    })
}

exports.delete          = (req, res) => {
    const {
        prizeId
    }                   = req.params;

    prizeService.deletePrize(prizeId, (error, result) => {
        if(error) {
            return res.status(400).json(response.build('ERROR', 
                errorHelper.parseError(error) 
            ));  
        }
        return res.status(200).json(response.build('SUCCESS', { "data" : result }));
    })
}