const request   = require('request');

exports.call    = (url, method, headers, body, params, callback) => {

    request({
        method  : method,
        uri     : url,        
        headers
    }, function (error, response, body) {
        if (error) {
          return callback(error)
        }
        return callback(null, body)
    })
}