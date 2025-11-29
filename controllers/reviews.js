const listing = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.createreview=async(req,res)=>{
    let listingData=await listing.findById(req.params.id);
    let newReview=new Review({
      comment: req.body.review.comment,
      rating: req.body.review.rating,
      author: req.user._id ,
    });

  
    listingData.reviews.push(newReview);
    await newReview.save();
    await listingData.save();
    req.flash("success","New review added");
    res.redirect(`/listing/${listingData._id}`);
  }

module.exports.deletereview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/listing/${id}`);

  }