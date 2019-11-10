import passport from 'passport'
import { ExtractJwt } from 'passport-jwt'
import User from './app/models/User.model'
const LocalStrategy = require('passport-local').Strategy
var JWTStrategy = require('passport-jwt').Strategy

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: 'somesecretkey'
}, async (payload, done) => {
  try {
    //console.log(payload)
    const user = await User.findById(payload.sub)
    //console.log(user)
    if(!user) {
      return done(null, false, {message: "User does not exist"})
    }
    //console.log("Reached here")
    done(null, user)

  }catch(err){
    console.log(err)
    done(err, false)
  }
}))

//local strategy
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async(username, password, done) => {
  try{
    console.log("Hello there", username, password)
    const user = await User.findOne({username})

    if(!user){
      return done(null, false, {message: "User not found"})
    }
    const isMatch = await user.validatePassword(password)
    if(!isMatch){
      return done(null, false, {message: "Passwords don't match"})
    }

    return done(null, user)
  }catch(err){
    done(null, false, {message: "Some error occures"})
  }
}))

module.exports = passport;