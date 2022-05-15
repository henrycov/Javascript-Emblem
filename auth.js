//Sets up passport strategy
const console = require('console');

module.exports = (dbClient) => {
    const passport = require('passport');
    const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
    const path = require("path");
    require("dotenv").config({ path: path.resolve(__dirname, '.env') })
    const database = require("./mongoDB");


    passport.use(new GoogleStrategy({
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/google/callback",
        passReqToCallback   : true
    },
    async function(request, accessToken, refreshToken, profile, done) {
        //Sets up user within mongo database
        dbClient.collection = process.env.MONGO_USERS
        let result = await dbClient.upsert({email: profile.email}, {displayName: profile.displayName});
        await dbClient.createUserCollection(result._id.toString());

        return done(null, profile);
    }
    ));

    passport.serializeUser(function(user,done) {
        done(null, user);
    })

    passport.deserializeUser(function(user,done) {
        done(null, user);
    })
};