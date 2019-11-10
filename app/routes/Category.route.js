import express from 'express'
import {check} from 'express-validator'
import passport from '../../passport'
import Category from '../controller/Category.controller'

let router = express.Router()

router.use(
  passport.authenticate('jwt', {session: false})
)

router.post('/',
  [
    check('name').not().isEmpty()
  ],
  Category.addCategory
)

router.get(
  '/',
  Category.getCategories
)

router.delete(
  '/:category_id',
  Category.deleteCategory
)

export default router