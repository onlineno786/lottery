const constant              = require(__basePath + '/app/core/constant');
const validation            = {};
const underscore            = require('underscore');

validation.parseValidationErrors = function (errors) {
    let errorObject = {};

    Object.keys(errors).forEach(function (value) {
        errorObject[value] = errors[value].msg;
    });

    return errorObject;
};

validation.parseDatabaseErrors = function (dbErrors = []) {
    let errors = [];

    dbErrors.forEach(function (error) {
        errors.push({
            "param"     : error.path,
            "message"   : error.message
        })
    });

    return {errors};
};

validation.parseError = function(error) {
    return {
        "message" : error
    }
}

validation.findMongoError   = function(error, field = 'Any field') {

    if(underscore.has(error, 'code')) {
        const errorCode         = error.code;
        const values            = error.keyValue;

        if(constant.MONGO_ERROR_CODE.DUPLICATE.includes(errorCode.toString())) {
            return `${field} is duplicate. Please check.`
        }
    }

    return error._message ? error._message : 'Something went wrong!';
}

module.exports = validation;