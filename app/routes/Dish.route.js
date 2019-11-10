import express from 'express'
import passport from '../../passport'
import { check } from 'express-validator'
import Dish from '../controller/Dish.controller'

let router = express.Router()

router.use(passport.authenticate('jwt', {session: false}))

router.post('/',
  [
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('category').not().isEmpty(),
    check('serving').not().isEmpty()
  ],
  Dish.addDish
)

router.get('/',
  Dish.viewAllDishes
)

router.get('/search/:query',
  Dish.searchDish
)

router.get('/:dish_id',
  Dish.getSpecificDish
)

export default router