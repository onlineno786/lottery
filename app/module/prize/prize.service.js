const constant              = require(__basePath + '/app/core/constant');
const Prize                 = require(constant.path.module + 'prize/prize.schema');
const errorHelper           = require(constant.path.app + 'util/errorHelper');
const Subscription          = require(constant.path.module + 'prize/subscription.schema');

// create a prize
exports.createPrize          = (payload, callback) => {
    const prize              = new Prize(payload);

    prize.save(function(error, result) {
        if(error) {
            console.log(error)
            return callback(errorHelper.findMongoError(error))
        }
        return callback(null, result);
    })
}

// get all prize
exports.getPrizes            = (query, callback) => {
    Prize.find(query, (error, result) => {
        if(error) {
            return callback(errorHelper.findMongoError(error))
        }
        return callback(null, result);
    })
}

// get all subs
exports.getSubscriptions            = (query, callback) => {
    const pipeline  = [
        {
            $match  : query
        },
        {
            $lookup             : {
                from            : 'prizes',
                localField      : 'prizeId',
                foreignField    : '_id',
                as              : 'prize'
            }
        },
        {
            $unwind             : '$prize'
        }
    ]
    Subscription.aggregate(pipeline).exec((error, result) => {
        if(error) {
            return callback(errorHelper.findMongoError(error))
        }
        return callback(null, result);
    })
}

// create a subscription
exports.createSubscription      = (payload, callback) => {
    const subscription          = new Subscription(payload);

    subscription.save(function(error, result) {
        if(error) {
            console.log(error)
            return callback(errorHelper.findMongoError(error))
        }
        return callback(null, result);
    })
}