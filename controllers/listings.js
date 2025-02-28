const listing=require("../models/listing");
const { listingSchema } = require("../schema.js");
module.exports.index=async (req, res) => {
    const alllisting = await listing.find({});
    res.render("listing/listing.ejs", { alllisting });
}

module.exports.new=(req, res) => {
    res.render("listing/new.ejs");
};

module.exports.show= async (req, res) => {
    let { id } = req.params;
    const data = await listing.findById(id).populate({path:'reviews',populate:{path:'author', },}).populate("owner");
    if(!data){
      req.flash("error","listing does not exist!");
      res.redirect("/listing");
    }else{
    res.render("listing/show.ejs", { data });
    }
   
  }

  module.exports.create = async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
  
    
    const newListing=new listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect("/listing");
  };




  module.exports.edit=async (req, res) => {
    let { id } = req.params;
    const listing1 = await listing.findById(id);
    if(!listing1){
      req.flash('error',"listing not exist");
      res.redirect("/listing")
    }else{
    res.render("listing/edit.ejs", { listing1 });
    }
  };




  module.exports.update=async (req, res) => {
      let { id } = req.params;
      let listing2=await listing.findByIdAndUpdate(id, { ...req.body.listing });
      if(typeof req.file!="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing2.image={url,filename};
      await listing2.save();
      }
      req.flash("sucess","listing updated");
      res.redirect(`/listing/${id}`);
    };
    
    
    



  module.exports.delete=async (req, res) => {
      let { id } = req.params;
      let deletedListing = await listing.findByIdAndDelete(id);
      req.flash("sucess","listing  deleted");
      res.redirect("/listing");
    };
  