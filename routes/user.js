const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { isLoggedIn,saveRedirectUrl} = require("../middlewares.js");
const userController = require("../controllers/users.js");
const user = require("../models/user.js");


router
 .route("/signup")
 .get( userController.renderSignUpForm)
 .post( wrapAsync(userController.signup));



router
 .route("/login")
 .get( userController.renderLogInForm)
 .post(
    
    saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:'/login',
         failureFlash:true}),
    wrapAsync(userController.login))


router.get("/logout",userController.logout);

module.exports = router;