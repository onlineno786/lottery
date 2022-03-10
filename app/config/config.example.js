module.exports = {
    SERVER      : {
        URL     : 'http://localhost:3300/',
        PORT    : 3300
    },
    SERVICES    : {
        MEDIA   : {
            ALLOWED_MEDIA_TYPES     : ['image/jpeg', 'image/jpg', 'image/png'], 
            MAX_MEDIA_SIZE          : 1024 * 1024 * 5, // Max allowed - 5 MB
            MAX_MEDIA_COUNT         : 10 
        }
    }
}