require('dotenv/config');
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user.model');

const secret = process.env.JWT_SECRET || 'new-default-secret';

const jwtOptions  = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: '10',
    //issuer: config.jwt.issuer,
    //audience: config.jwt.audience,
};

module.exports = passport => {
    passport.use(new Strategy(jwtOptions, (jwt_payload, done) => {
        User.findById(jwt_payload.id).populate('role').then(user => {
            if (user) {
                return done(null, {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    admin_level: user.admin_level
                });
            } else {
                done(null, false);
            }
        }).catch(err => console.log(err));
        })
    );
};
