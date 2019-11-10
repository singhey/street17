import mongoose from 'mongoose'

let CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true
  },
  timestamps:{ }
})

export default mongoose.model('Category', CategorySchema)