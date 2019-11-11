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
      return done({message: "User does not exist"}, false)
    }
    //console.log("Reached here")
    done(null, user)

  }catch(err){
    console.log(err)
    done(err, {message: "Internal error"})
  }
}))

//local strategy
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async(username, password, done) => {
  try{
    const user = await User.findOne({username})

    if(!user){
      return done({message: "You do not exist. Maybe try creating an account"}, false)
    }
    const isMatch = await user.validatePassword(password)
    if(!isMatch){
      return done({message: "You had one simple job. Can't even remember your password, dumbo!"}, false)
    }
    return done(null, user)
  }catch(err){
    done({message: "Umm... server isn't working well. Come back later, give it another shot"}, false)
  }
}))

module.exports = passport;