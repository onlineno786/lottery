const mongoose      = require('mongoose');

mongoose.set('useCreateIndex', true);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
var prizeSchema     = new mongoose.Schema({
    name            : {
        type        : String,
        required    : true
    },
    price           : {
        type        : Number,
        required    : true
    },
    prizes          : {
        type        : Array,
        required    : true,
    },
    history         : {
        type        : Boolean,
        required    : true,
        default     : false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('prize', prizeSchema);