const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');

passport.use(new LocalStrategy(
    {passReqToCallback : true},
    function(req, username, password, done) {
        User.findOne({ username: username, type: {$lt: 2}}, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (result !== true){
                    return done(null, false, { message: 'Incorrect password.' });
                } else {
                    return done(null, user);
                }
            })

        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.userId)
})

passport.deserializeUser(function(id, done) {
    User.findOne({userId: id}, function(err, user) {
        done(err, user);
    });
});
