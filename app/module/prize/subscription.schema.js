const mongoose      = require('mongoose');

mongoose.set('useCreateIndex', true);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
var subscriptionSchema     = new mongoose.Schema({
    prizeId         : {
        type        : mongoose.Schema.ObjectId,
        required    : true
    },
    userId          : {
        type        : mongoose.Schema.ObjectId,
        required    : true
    },
    price           : {
        type        : Number,
        required    : true
    },
    code            : {
        type        : Number,
        required    : true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('subscription', subscriptionSchema);