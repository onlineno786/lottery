const constant          = require(__basePath + 'app/core/constant');
const config            = require(constant.path.app + 'config/index.js');
const response          = require(constant.path.app + 'util/response');
const errorHelper       = require(constant.path.app + 'util/errorHelper');
const messages          = require(constant.path.app + 'core/response')
const userService       = require(constant.path.app + 'module/user/user.service');
const underscore        = require('underscore');
const multer            = require('multer');

var imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __basePath + '/public/assets/uploads/')
    },
    filename: function (req, file, cb) {

        if(!file.originalname.match(/\.(jpeg|png|jpg|JPG)$/)) {
            let err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            cb(null,Date.now() + '_' + file.originalname.replace(/ /g,'')) // replace - to remove all white spaces
        }
    }
});

var upload = multer({
    storage: imageStorage,
    limits : { fileSize : 100000000000000 }
}).single('thumbnail');

exports.user            = (req, res) => {
    const body          = req.body;
    
    const payload       = {
        'name'          : body.name,
        'mobileNumber'  : body.mobileNumber,
        'password'      : body.password
    }

    userService.createUser(payload, (error, result) => {
        if(error) {
            return res.status(400).json(response.build('ERROR', 
                errorHelper.parseError(error) 
            ));  
        }
        return res.status(200).json(response.build('SUCCESS', { "data" : result }));
    })
}

exports.getAll          = (req, res) => {

    // get all registered users
    userService.getUsers(req.query, (error, result) => {
        if(error) {
            return res.status(400).json(response.build('ERROR', 
                errorHelper.parseError(error) 
            ));  
        }
        return res.status(200).json(response.build('SUCCESS', { "data" : result }));
    })
}

exports.register        = (req, res) => {
    const body          = req.body;

    userService.createUser(body, (error, result) => {
        if(error) {
            return res.status(400).json(response.build('ERROR', 
                errorHelper.parseError(error) 
            ));  
        }
        return res.status(200).json(response.build('SUCCESS', { "data" : result }));
    })
}

exports.login           = (req, res) => {
    const body          = req.body;
    
    const payload       = {
        'mobileNumber'  : body.mobileNumber,
    }

    userService.login(payload, body.password, (error, result) => {
        if(error) {
            return res.status(400).json(response.build('ERROR', 
                errorHelper.parseError(error) 
            ));  
        }
        return res.status(200).json(response.build('SUCCESS', { "data" : result }));
    })
}

exports.me              = (req, res) => {
    return res.json(req.user);
}

exports.update          = (req, res) => {
    const body          = req.body;
    
    const payload       = {
        'name'          : body.name
    }

    userService.updateUser(req.user._id, payload, (error, result) => {
        if(error) {
            return res.status(400).json(response.build('ERROR', 
                errorHelper.parseError(error) 
            ));  
        }
        return res.status(200).json(response.build('SUCCESS', { "data" : result }));
    })
}

exports.media           = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            if(err.code === 'LIMIT_FILE_SIZE') {
                res.json({
                    success : false,
                    message : 'File is too large.'
                })
            } else if(err.code === 'filetype') {
                res.json({
                    success : false,
                    message : 'File type invalid.'
                })
            } else {
                console.log(err);
                res.json({
                    success : false,
                    message : 'File was not able to be uploaded'
                })
            }
        } else {

            if(!req.file) {
                res.json({
                    success: false,
                    message: 'File missing.'
                })
            } else {
                res.json({
                    success : true,
                    message : 'File Uploaded successfully.',
                    filename : req.file.filename
                })
            }
        }
    })
}