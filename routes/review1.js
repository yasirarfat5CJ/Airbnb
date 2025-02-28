const express = require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrap.js');
const listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedin, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");






//reviews route
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.createreview));
  
  //delte review route
  router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.deletereview));

  
    
  
  
  module.exports=router;