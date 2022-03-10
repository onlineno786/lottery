const mongoose      = require('mongoose');
const bcrypt        = require('bcryptjs');

mongoose.set('useCreateIndex', true);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
var userSchema      = new mongoose.Schema({
    name            : {
        type        : String,
        required    : true,
        default     : 'User'
    },
    mobileNumber    : {
        type        : String,
        unique      : true,
        required    : true,
        index       : true
    },
    password        : {
        type        : String,
        required    : true,
        select      : false
    },
    role            : {
        type        : String,
        required    : true,
        default     : 'USER'
    }
}, {
    timestamps: true
});

// pre save hook
userSchema.pre('save', function (next) {

    const user = this;

    if(!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10, function(err, hash) {
        // Store hash in your password DB.
        if(err) {
            return next(err);
        } else {
            user.password = hash;
            next();
        }
    });
});

// Password compare method
userSchema.methods.comparePassword = (password, hash, callback) => {
    return bcrypt.compareSync(password, hash);
};

module.exports = mongoose.model('user',userSchema);