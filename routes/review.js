const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js")
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middlewares.js");
const reviewController = require("../controllers/reviews.js")


//REview 
//Post Review Route
router.post(
    "/",
    isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Delete Review route

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports= router;