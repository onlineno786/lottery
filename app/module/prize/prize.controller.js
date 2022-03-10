const constant          = require(__basePath + 'app/core/constant');
const config            = require(constant.path.app + 'config/index.js');
const response          = require(constant.path.app + 'util/response');
const errorHelper       = require(constant.path.app + 'util/errorHelper');
const messages          = require(constant.path.app + 'core/response')
const prizeService      = require(constant.path.app + 'module/prize/prize.service');
const underscore        = require('underscore');
const Utility           = require(constant.path.app + 'util/utility.js');

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

    if(req.query.prizeId) {
        req.query       = { _id : Utility.toObjectId(req.query.prizeId) }
    }

    // get all registered prizes
    prizeService.getPrizes(req.query, (error, result) => {
        if(error) {
            return res.status(400).json(response.build('ERROR', 
                errorHelper.parseError(error) 
            ));  
        }
        return res.status(200).json(response.build('SUCCESS', { "data" : result }));
    })
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
                return res.status(400).json(response.build('SUCCESS', { "message" : 'You have already purchased! enjoy!', subscription }));

            }
        })
    })
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