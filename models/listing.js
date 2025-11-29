const mongoose = require("mongoose");
const review = require("./review.js");
const { required } = require("joi");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    category: {
        type: String,
        enum: ["trending", "mountains", "arctic", "farms", "pools", "iconic-cities", "new", "domes", "play"]
    }


});
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
})


const listing = mongoose.model("listing", listingSchema);
module.exports = listing;