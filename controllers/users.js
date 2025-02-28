const User=require("../models/user.js");
module.exports.singuproute=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registerUser=await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
        return next(err);
    }
    req.flash("sucess","welcome to WanderLust");
    res.redirect("/listing");
    })

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/singup");
    }
}

module.exports.loginroute= async(req,res)=>{
    req.flash("sucess",'welcome back to wanderLust ');
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logoutroute=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
         next(err);
        }
        req.flash("sucess","you are logged out");
        res.redirect("/listing");
    })
}