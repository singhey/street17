import express from 'express'
let router = express.Router()
import JWT from 'jsonwebtoken'
import User from '../models/User.model'
import passport from 'passport'
require('../../passport')


const tokenGenerator = user => {
  if(user === undefined){
    throw Error("user is not defined")
  }
  return JWT.sign({
    issuer: 'Street17',
    sub: user._id
  }, 'somesecretkey')
}

router.post('/register', async (req, res, next) => {
  let user = new User({
    username: req.body.username,
    password: req.body.password
  })

  user.save(err => {
    if(err){
      next({message: err, status: err.status || 500})
      return
    }

    //res.send({message: "User added succesfully"})
    

    res.status = 201
    res.send({
      message: "User created succesfully",
      token: tokenGenerator(user)
    })
  })

})



router.post('/login', 
  passport.authenticate('local', {session: false}),
  async (req, res, next) => {
  try{
    const user = await User.findOne({username: req.body.username})
    const token = tokenGenerator(user)
    res.send({
      message: "Login successful",
      token
    })
  } catch(err) {
    next(err)
  }
  
})

export default router;