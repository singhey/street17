import Dish from './Dish.controller'
import { validationResult } from 'express-validator'
import BillModel from '../models/Bill.model'

module.exports = {

  addBill: async(req, res, next) => {
    try {

      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(403).send(errors)
      }

      let total = 0
      let items = []
      for(let i = 0; i < req.body.items.length; i++){
        let price = await Dish.dishServingPrice(req.body.items[i]._id, req.body.items[i].size)
        if(price === -1)
          res.send({error: true, price: -1})
        items.push({
          item_id: req.body.items[i]._id,
          quantity: req.body.items[i].quantity,
          price,
          size: req.body.items[i].size
        })
        total += (price * req.body.items[i].quantity)
      }
      let tax = Math.round(total * 5) / 100
      let bill = new BillModel({
        items,
        subTotal: total,
        tax,
        donation: req.body.donation,
        createdBy: req.user._id
      })

      bill.save(function(err){
        if(err){
          return next("unable to save bill")
        }
        res.send({message: "Billsaved successfully", success: true})
      })

    }catch(err) {
      console.log(err)
      next({message: "Internal error occured. View logs to find out why"})
    }
  },

  getBill: async(req, res, next) => {
    const bills = await BillModel.find()
    res.send(bills)
  }

}