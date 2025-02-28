const express=require("express");
const router=express.Router();
const wrapAsync=require('../utils/wrap.js');
const multer = require("multer");

const { isLoggedin,isowner,validatelisting }=require("../middleware.js");

const listingController=require("../controllers/listings.js");
const {storage}=require("../cloud.js");
const upload= multer({ storage });


router.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedin,upload.single('listing[image]'),validatelisting,
wrapAsync(listingController.create));


//New Route
router.get("/new", isLoggedin,listingController.new);
  


router.route("/:id")
.get(wrapAsync(listingController.show))//show
.put(isLoggedin,isowner,upload.single('listing[image]'),validatelisting ,wrapAsync(listingController.update))//update
.delete(isLoggedin,isowner,wrapAsync(listingController.delete ));//delete

  
  
  
  
  

  
  
  
  
  
  
  
  //Edit Route
router.get("/:id/edit",isLoggedin,isowner,wrapAsync(listingController.edit));
  
  
  
  
  
  
  
  //Update Route
  
  
  
  
  


  module.exports=router;