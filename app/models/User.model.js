import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: String
}, {strict: true})

UserSchema.pre('save', async function(next){
  try{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
  }catch(err){
    next(err)
  }
})

UserSchema.pre('save', async function(next){
  try{
    console.log(this.password)
    const user = await User.findOne({username: this.username})
    if(user){
      return next({message: "User already exists", status: 403})
    }
    next()
  }catch(err){
    next(err)
  }
})

UserSchema.methods.validatePassword = async function(newPassword) {
  try{
    const res =  await bcrypt.compare(newPassword, this.password)
    console.log("Password matched", res)
    return res
  }catch(error){
    throw new Error(error)
  }
}

let User = mongoose.model('User', UserSchema)

export default User;