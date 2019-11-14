import express from 'express'
import passport from '../passport'
import Bill from '../controller/Bill.controller'
import { check } from 'express-validator'

let router = express.Router()

router.use(
  passport.authenticate('jwt', {session: false})
)

router.post('/',
  [
    check('items').not().isEmpty(),
    check('donation').not().isEmpty()
  ],
  Bill.addBill
)

router.get('/',
  Bill.getBill
)

export default router
