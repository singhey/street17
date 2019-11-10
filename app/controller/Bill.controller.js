import Dish from './Dish.controller'
import { validationResult } from 'express-validator'

module.exports = {

  addBill: async(req, res, next) => {
    try {

      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(403).send(errors)
      }

      let total = 0
      for(let i = 0; i < req.body.items.length; i++){
        let price = await Dish.dishServingPrice(req.body.items[i].id, req.body.items[i].size)
        if(price === -1)
          res.send({error: true, price: -1})
        total += price
      }
      res.send({price: total})
    }catch(err) {
      console.log(err)
      next({message: "Internal error occured. View logs to find out why"})
    }
  }

}