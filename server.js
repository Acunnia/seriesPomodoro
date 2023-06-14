require('dotenv/config');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 80;
const path = require('path');
const passport = require('passport');
const mongoose = require("mongoose");

// Middleware for JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors middleware
app.use(cors());

// Initialize passport configuration
app.use(passport.initialize());

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
        console.log(`mernBB server running on port ${port}`);
    });
});
