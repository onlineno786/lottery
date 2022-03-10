const constant              = require(__basePath + '/app/core/constant');
const config                = require(constant.path.app + 'config/index.js');
const messages              = require(constant.path.app + 'core/response')
const User                  = require(constant.path.module + 'user/user.schema');
const errorHelper           = require(constant.path.app + 'util/errorHelper');
const jwtService            = require(constant.path.app + 'service/jwt.service');
const underscore            = require('underscore');

// create a User
exports.createUser          = (payload, callback) => {
    const user              = new User(payload);

    user.save(function(error, result) {
        if(error) {
            console.log(error)
            return callback(errorHelper.findMongoError(error, 'Mobile Number'))
        }
        return callback(null, result);
    })
}

// login user
exports.login               = (query, password, callback) => {
    User.findOne(query).select('password _id name role').exec(function(error, user) {
        if(error) {
            return callback(errorHelper.findMongoError(error))
        }

        if(underscore.isEmpty(user)) {
            return callback(messages.RESPONSE_MESSAGES.ERROR.USER.INVALID)
        }
        const passwordMatch     = user.comparePassword(password, user.password);

        if(passwordMatch) {
            const auth          = {
                'user'          : user,
                'authToken'     : jwtService.encode({ userId : user._id })
            }
            return callback(null, auth);

        } else {
            return callback(messages.RESPONSE_MESSAGES.ERROR.USER.WRONG_PASSWORD);
        }        
    })
}

// get all User
exports.getUsers            = (query, callback) => {
    User.find(query, (error, result) => {
        if(error) {
            return callback(errorHelper.findMongoError(error))
        }
        return callback(null, result);
    })
}

// update profile
exports.updateUser          = (userId, payload, callback) => {
    User.findByIdAndUpdate(userId, payload, (error, result) => {
        if(error) {
            return callback(errorHelper.findMongoError(error))
        }
        return callback(null, result);
    })
}