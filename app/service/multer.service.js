const multer            = require('multer');
const constant          = require(__basePath + 'app/core/constant');
const config            = require(constant.path.app + 'config/index');
const response          = require(constant.path.app + 'core/response');
const Utility           = require(constant.path.app + 'util/utility.js');
const multerS3          = require('multer-s3')
const AWS               = require('aws-sdk');
const s3                = new AWS.S3();

AWS.config.update({
    accessKeyId       : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey   : process.env.AWS_SECRET_ACCESS_KEY,
});

// TODO - invalid file type + max size. 
const upload              = multer({
    storage               : multerS3({
        s3                  : s3,
        bucket              : process.env.AWS_S3_BUCKET_NAME,
        key                 : function (req, file, cb) {
            const ext       = file.originalname.split('.').pop();
            const name      = Utility.UUID().replace(/-/g, '');
            const fullName  = name + '.' + ext;
            cb(null, fullName)
        }
    })
})

module.exports            = upload;