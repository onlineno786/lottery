const constant                  = require(__basePath + 'app/core/constant');
const errorHelper               = require(constant.path.app + 'util/errorHelper');
const responseHelper            = require(constant.path.app + 'util/response');

exports.addUser                 = function (req, res, next) {
    
    let validationSchema        = {
        // mobile number validator
        'mobileNumber' : {
            notEmpty : true,
            errorMessage : 'Mobile number cannot be empty!'
        },
        'name' : {
            notEmpty : false,
            errorMessage : 'Name cannot be empty!'
        }
    };
    
    req.checkBody(validationSchema);

    req.getValidationResult().then(function (result) {
        if(false == result.isEmpty()) {
            return res.status(400).json(responseHelper.build(
                'ERROR_VALIDATION',
                errorHelper.parseValidationErrors(result.mapped())
            )).end();
        }
        
        next();
    });
};