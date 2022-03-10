const Passport          = require('passport');
const JwtStrategy       = require('passport-jwt').Strategy,
      ExtractJwt        = require('passport-jwt').ExtractJwt;
      AnonymousStrategy = require('passport-anonymous').Strategy;

const constant          = require(__basePath            + '/app/core/constant');
const config            = require(constant.path.app     + 'config/index');
const User              = require(constant.path.module  + 'user/user.schema.js');

const opts              = {
    jwt                 : {
        jwtFromRequest      : ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey         : process.env.JWT_SECRET,
        passReqToCallback   : true
    }
};

module.exports          = {
    init                : () => {
        Passport.serializeUser(function(user, done) {
            done(null, user);
        });
          
        Passport.deserializeUser(function(user, done) {
            done(null, user);
        });
        
        //PassportJs JWT strategy for user normal registration and login 
        Passport.use('user',new JwtStrategy(opts.jwt, function(req, jwt_payload, done) {
            User.findOne({
                _id  : jwt_payload ? jwt_payload.userId || null : null
            })
                .then(u => {
                    if(u && u.role && u.role.toUpperCase() === 'USER') {
                        done(null, u);                    
                    }
                    else done(null, false);
                })
                .catch(e => done(e, false));
        }));

        Passport.use('admin',new JwtStrategy(opts.jwt, function(req, jwt_payload, done) {            
            User.findOne({
                _id  : jwt_payload ? jwt_payload.userId || null : null
            })
                .then(u => {
                    if(u && u.role && u.role.toUpperCase() === 'ADMIN') {
                        done(null, u);                    
                    }
                    else done(null, false);
                })
                .catch(e => done(e, false));
        }));

        Passport.use(new AnonymousStrategy());
    }
};