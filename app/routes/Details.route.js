import express from 'express'
import passport from '../passport'
import Details from '../controller/Details.Controller'

let router = express.Router()
router.use(
  passport.authenticate('jwt', {session: false})
)

router.get('/',
  Details.getDetails
)

router.post('/',
  Details.addDetails
)

export default router