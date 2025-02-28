if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User=require("./models/user.js");// for model schema
const Review = require("./models/review.js");



const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');


const ExpressError = require("./utils/express.js");

const listings=require("./routes/listing1.js");
const reviews=require("./routes/review1.js");
const user=require("./routes/user.js");// to sing up

const dbUrl=process.env.Atlasurl;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

  async function main() {
    await mongoose.connect(dbUrl);
  }
  

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));


const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
  httpOnly:true,
})
store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOption={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,//to prevent frm cross scripting tags
  }

}






app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());//to store the user relates information in the session
passport.deserializeUser(User.deserializeUser());//remove the information from the session when user  logout



app.use((req,res,next)=>{
  res.locals.sucess=req.flash('sucess');
  res.locals.error=req.flash('error');
  res.locals.curruser=req.user;
  next();
})



// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"abc@gmail.com",
//     username:"abcd",
//   })
//    let registerUser= await User.register(fakeUser,"password");
//    res.send(registerUser);
// })


app.use("/listing",listings);
app.use("/listing/:id/reviews",reviews);
app.use("/",user);





app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"));
})


//error handler
app.use((err,req,res,next)=>{
  let {status=500,message="something wents wrong"}=err;
  // res.status(status).send(message);
  res.render("err.ejs",{message});
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

















