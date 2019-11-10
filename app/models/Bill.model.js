import mongoose from 'mongoose'

let BillSchema = new mongoose.Schema({
  items: [
    {
      item_id: {
        type: String, 
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number, 
        required: true
      }
    }
  ],
  subTotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  donation: {
    type: Number
  },
  timestamps: {},
  createdBy: {
    type: String,
    required: true
  }
})

export default mongoose.model('Bill', BillSchema)