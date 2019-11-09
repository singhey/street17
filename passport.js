import passport from 'passport'
import { ExtractJwt } from 'passport-jwt'
import User from './app/models/User.model'
const LocalStrategy = require('passport-local').Strategy
var JWTStrategy = require('passport-jwt').Strategy

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: 'somesecretkey'
}, async (payload, done) => {
  console.log("hello jwt")
  try {
    console.log("This was called")
    console.log(payload)
    const user = await User.findById(payload.sub)

    if(!user) {
      return done(null, false)
    }

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
      return done(null, false)
    }
    const isMatch = await user.validatePassword(password)
    if(!isMatch){
      return done(null, false)
    }

    return done(null, user)
  }catch(err){
    done(null, false)
  }
}))

module.exports = passport;