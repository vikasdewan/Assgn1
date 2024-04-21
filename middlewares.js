const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You have to logged in to Create Listing");
        return res.redirect("/login");
    }

        next();
};


module.exports.saveRedirectUrl = (req,res,next)=>{
    console.log(req.session.redirectUrl);
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        // console.log(res.locals.redirectUrl);
    }
     return next();
}


module.exports.isOwner = async(req,res,next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to Edit This Listing");
        return res.redirect(`/listings/${id}`);
    }

    next();

}



//validate listing schema
module.exports.validateListing = (req,res,next)=>{
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}



//validate reviews
module.exports.validateReview = (req,res,next)=>{
    let {error} =  reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    let  { id,reviewId}= req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You're not the author of that review");
        return res.redirect(`/listings/${id}`);
    }

    next();

}