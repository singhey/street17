import mongoose from 'mongoose'

let DetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  gst: {
    type: String,
  },
  tin: {
    type: String
  }
}, { timestamps: { createdAt: 'created_at' }})

export default mongoose.model('Details', DetailsSchema)