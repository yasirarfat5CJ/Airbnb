const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";


async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

const initdb=async()=>{
    // await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'67bc9a8c348ade62c9ad78d8'}))
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
}
initdb();