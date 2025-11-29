const { required } = require('joi');
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=new Schema({
   
    email:{
        type:String,
        required:true,
    }
});
userSchema.plugin(passportLocalMongoose);//it is used becoz it automatically creates password and username

const User=mongoose.model("User",userSchema);
module.exports=User;