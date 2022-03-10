const basePath      = __basePath;
module.exports      = {
    path: {
        base    	: basePath,
        app     	: basePath + 'app/',
        module  	: basePath + 'app/module/',
        service     : basePath + 'app/service/',
        middleware  : basePath + 'app/middleware/'
    },
    MONGO_ERROR_CODE: {
        DUPLICATE   : ['11000', '11000']
    }
}
