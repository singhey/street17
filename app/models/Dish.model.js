import mongoose from 'mongoose'

let DishSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  serving: [
    {
      size: {
        enum: ['R', 'M', 'L'],
        required: true,
        type: String
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  category: {
    type: String,
    required: true
  },
  image: {
    type: Buffer
  },
  createdBy: {
    type: String,
    required: true
  },
  timestamps: {
    
  }
})

let Dish = mongoose.model('Dish', DishSchema)
export default Dish