import Details from '../models/Details.model'

module.exports = {
  getDetails: (req, res, next) => {
    Details.findOne().sort('-created_at').exec(function(err, details){
      if(err){
        res.send({message: "Error fetchign details", success: false})
      }
      res.send({details, success: true})
    })
  },

  addDetails: (req, res, next) => {
    let details = new Details({
      name: req.body.name,
      address: req.body.address,
      tin: req.body.tin || '',
      gst: req.body.gst || ''
    })

    details.save(function(err){
      if(err){
        return next({message: "Error daving details", success: false})
      }
      res.send({message: "Details saved", success: false})
    })
  }
}