require('dotenv/config');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 80;
const path = require('path');
const passport = require('passport');
const mongoose = require("mongoose");
const controllers = require('./routes')
const userController = require('./routes/user')
const User = require("./models/user.model");
const { Strategy, ExtractJwt } = require('passport-jwt');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use(passport.initialize());
const passportOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'mernBB-default-secret',
};


passport.use(
    new Strategy(passportOptions, (payload, done) => {
        User.findById((payload.id).populate('role').then(user => {
            if (user) {
                return done(null, {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    admin_level: user.admin_level
                })
            } else {
                done(null, false)
            }
        }).catch(err => console.log(err)))
    })
)


// API Routers
app.use('/api/users', controllers.userController);
app.use('/api/categories', controllers.categoryController);


// If no API routes are hit, send the build version of the React client
app.use(express.static(path.join(__dirname, './client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// MongoDB connection
const connectDb = () => {
    return mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

connectDb().then(async () => {
    app.listen(port, () => {
        console.log(app._router.stack)
        console.log(`Server running on port ${port}`);
    });
});
