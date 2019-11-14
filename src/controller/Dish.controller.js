import { validationResult } from 'express-validator'
import Dish from '../models/Dish.model'
var path = require('path');

async function makeDish(req){
  //console.log(req.files)
  let dish = {}
  dish.name = req.body.name
  dish.category = req.body.category
  dish.description = req.body.description
  
  let serv = []
  //console.log("Reached till serving")
  let serving = JSON.parse(req.body.serving)
  //console.log(serving)
  for(let i = 0; i < serving.length; i++){
    serv.push({
      price: serving[i].price,
      size: serving[i].size
    })
  }
  //console.log("Completed for loop")
  dish.serving = serv
  dish.createdBy = req.user._id

  //console.log("found user")
  //uploading file
  if(req.files === null)
    return dish
  let image = req.files.image
  let stored_path = '/images/'+new Date().getTime()+'_'+image.name
  let file_path = path.join(__dirname,'../public'+stored_path);
  //console.log(file_path)
  //console.log("Found the storage path")
  try{
    let saved = await image.mv(file_path)
    if(saved !== undefined){
      return false
    }
  }catch(err){
    return false
  }
  dish.image = stored_path
  //console.log("Image saved")
  return dish
}

module.exports = {

  addDish: async function(req, res, next) {
    //console.log("Now what is this")
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(403).send(errors)
    }
    try{
      //console.log("Now this is surprising")
      let dish = new Dish(await makeDish(req))
      //console.log("Reached this far")
      if(!dish){
        return next("Unable to form dish object")
      }
      let saved = dish.save()
      if(!saved){
        return next("Unable to save dish")
      }
      res.send({message: "Dish added succesfully"})

    }catch(err){
      //console.log(err)
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
  },

  deleteDish: async (req, res, next) => {
    try{
      let dish = await Dish.find({_id: req.param.dish_id})
      if(!dish){
        return res.status(402).send({message: "The selected category doesn't exist in db"})
      }
      let action = await Dish.findOneAndDelete({_id: req.params.dish_id})
      if(!action){
        return res.send({message: "Unable to delete"})
      }
      res.send({message: "Dish deleted successfully"})
    }catch(err){
      console.log(err)
      next({message: "Unable to perform action", error: err})
    }
  },

  updateDish: async(req, res, next) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(403).send(errors)
    }
    try{

      let dish = await makeDish(req)
      //delete dish._id
      //console.log("Dish after deleting is", dish)
      if(!dish){
        return next("Unable to update dish object")
      }
      //console.log(req.params.dish_id)
      //console.log("Dish", dish)
      Dish.findByIdAndUpdate({_id: req.params.dish_id}, dish, function(err, dish){
        if(err){
          console.log(err)
          return next("Error updating dish")
        }
        if(!dish){
          return res.send({message: "Unable to find dish"})
        }
        //console.log(dish)
        res.send({message: "Dish Updated succesfully"})
      })
      

    }catch(err){
      console.log(err)
      next({message: "Internal error occured. View logs to find out why"})
    }
  }
}