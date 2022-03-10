module.exports      = {
    "RESPONSES"     : {
        "SUCCESS"   : {
            "errorCode"     : 200,
            "message"       : "Success"
        },
        "ERROR"     : {
            "errorCode"     : 500,
            "message"       : "Failed"
        },
        "ERROR_VALIDATION" : {
            "errorCode"     : 400,
            "message"       : "Failed"
        }
    },
    RESPONSE_MESSAGES       : {
        ERROR               : {
            USER            : {
                INVALID         : 'User not found.',
                WRONG_PASSWORD  : 'Password did not match. Please try again.'
            }
        },
        SUCCESS             : {
            USER            : {
                PASSWORD_MATCH  : 'Password matched....loging you in..'
            }
        }
    }
}