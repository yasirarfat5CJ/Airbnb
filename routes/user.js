const express = require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require('../utils/wrap.js');
const passport=require("passport");
const { saveredirectUrl }=require("../middleware.js");
const userController =require("../controllers/users.js");


router.route('/singup')
.get((req,res)=>{
    res.render("users/singup.ejs");
})
.post(wrapAsync(userController.singuproute));







router.route('/login')
.get((req,res)=>{
    res.render("users/login.ejs");
})
.post(saveredirectUrl,passport.authenticate("local",
    {failueRedirect:'/login',
        failureFlash:true}),
        userController.loginroute);


//logout
router.get("/logout",userController.logoutroute);

module.exports=router;