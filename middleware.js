const listing=require("./models/listing");
const ExpressError = require("./utils/express.js");
const { listingSchema }=require("./schema.js");
const { reviewSchema }=require("./schema.js");
const review = require("./models/review.js");

module.exports.isLoggedin=(req,res,next)=>{

    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in");
        res.redirect("/login");
     }else{
     next();
     }
}
module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isowner=async(req,res,next)=>{
    let { id } = req.params;
    let listing1=await listing.findById(id);
    if(! listing1.owner.equals(res.locals.curruser._id)){
       req.flash("error","you don't have permission");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      throw new ExpressError(400,error);
     
    }else{
      next();
    }
  
  }


  module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
      throw new ExpressError(400,error);
     
    }else{
      next();
    }
  
  }


  //is review author

  module.exports.isReviewAuthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let listing1=await review.findById(reviewId);
    if(! listing1.author._id.equals(req.user._id)){
       req.flash("error","you are not allowed to delete this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
}