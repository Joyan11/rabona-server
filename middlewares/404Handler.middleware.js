const errorRouteHandler = (req,res,next)=>{
  res.status(404).json({status: false,message:"The Requested data could not be found"})
}


module.exports = {errorRouteHandler};