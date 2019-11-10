import { validationResult } from 'express-validator'
import Category from '../models/Category.model'

module.exports = {
  addCategory: async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(403).send(errors)
    }

    let category = new Category({
      name: req.body.name,
      createdBy: req.user._id
    })

    let saved = await category.save()
    if(!saved){
      next({message: "Unable to save category", error: saved})
    }
    res.status(201).send({message: "Category added succesfully"})
  },


  getCategories: async (req, res, next) => {
    let categories = await Category.find({createdBy: req.user._id})
    if(!categories){
      return next({message: "Error occured while retrieving categories"})
    }
    res.send(categories)
  },



  deleteCategory: async (req, res, next) => {
    try{
      let category = await Category.find({_id: req.param.category_id})
      if(!category){
        return res.status(402).send({message: "The selected category doesn't exist in db"})
      }
      let action = await Category.findOneAndDelete({_id: req.params.category_id})
      if(!action){
        return res.send({message: "Unable to send message"})
      }
      res.send({message: "Dish deleted successfully"})
    }catch(err){
      console.log(err)
      next({message: "Unable to perform action", error: err})
    }
  }
}