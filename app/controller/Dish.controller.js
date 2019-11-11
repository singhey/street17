import { validationResult } from 'express-validator'
import Dish from '../models/Dish.model'
var path = require('path');

async function makeDish(req){
  //console.log(req.files)
  let dish = new Dish()
  dish.name = req.body.name
  dish.category = req.body.category
  dish.description = req.body.description
  
  let serv = []
  let serving = JSON.parse(req.body.serving)
  for(let i = 0; i < serving; i++){
    serv.push({
      price: serving[i].price,
      size: serving[i].size
    })
  }

  dish.serving = serv
  dish.createdBy = req.user._id
  //uploading file
  if(req.files === undefined)
    return dish
  let image = req.files.image
  let file_path = path.join(__dirname,'../../public/images/'+new Date().getTime()+'_'+image.name);
  //console.log(file_path)
  try{
    let saved = await image.mv(file_path)
    if(saved !== undefined){
      return false
    }
  }catch(err){
    return false
  }
  dish.image = file_path
  return dish
}

module.exports = {

  addDish: async function(req, res, next) {

    //console.log(req.body)

    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(403).send(errors)
    }
    try{

      let dish = await makeDish(req)
      if(!dish){
        return next("Unable to form dish object")
      }
      let saved = dish.save()
      if(!saved){
        return next("Unable to save dish")
      }
      res.send({message: "Dish added succesfully"})

    }catch(err){
      console.log(err)
      next({message: "Internal error occured. View logs to find out why"})
    }
  },


  viewAllDishes: async (req, res, next) => {
    try {

      let dishes = await Dish.find({createdBy: req.user._id})
      if(!dishes){
        return res.send({messaged: "No dished found"})
      }
      res.send(dishes)

    }catch(err){
      console.log(err)
      next({message: "Internal error occured. View logs to find out why"})
    }
  },

  getSpecificDish: async (req, res, next) => {
    try{
      if(req.params.dish_id.length !== 24)
        return res.send({message: "Dish with that ID does not exist"})
  
      let dish = await Dish.findById(req.params.dish_id)
      if(!dish){
        return res.send({message: "Dish with that ID does not exist"})
      }
      res.send(dish)
    }catch(err) {
      console.log(err)
      next({message: "Internal error occured. View logs to find out why"})
    }
  },

  searchDish: async(req, res, next) => {
    try {
      let dishes = await Dish.find({
        name: {
          $regex: req.params.query,
          $options: 'i'
        },
        createdBy: req.user._id
      })
      if(!dishes || dishes.length === 0){
        res.send({message: "Dish doesn't exist", found: false})
      }
      res.send({found: true, dishes})
    }catch(err) {
      console.log(err)
      next({message: "Internal error occured. View logs to find out why"})
    }
  },


  dishServingPrice: async(dishId, size) => {
    try {
      console.log(dishId, "TThis is isd")
      if(dishId.length !== 24 || ['R', 'M', 'L'].indexOf(size) === -1){
        return -1
      }
      let dish = await Dish.findById(dishId)
      for(let i = 0; i < dish.serving.length; i++){
        if(dish.serving[i].size === size)
          return dish.serving[i].price
      }
      return -1
    }catch(err) {
      console.log(err)
      return -1
    }
  }
}