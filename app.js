if(process.env.NOD_ENV != "production"){
    require('dotenv').config()
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
// const { rmSync } = require("fs");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
// const Joi = require('joi');
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const dbUrl = process.env.ATLASDB_URL;

main()
.then((res)=>{console.log("connected to DB")})
.catch((err)=>{console.log(err)});

async function main(){
    await mongoose.connect(dbUrl);
}



app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method')); 
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));



//database
 

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret:process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err)
})

//express-session
const sessionOptions = {
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires :Date.now() + 7*24*60*60*1000,//date.now() show time in milisecond
        maxAge:7*24*60*60*1000,// 1 week
        httpOnly:true,
    },
};


//method to create new mongo store


app.use(session(sessionOptions));
app.use(flash());


//authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash msg popup for CRUD
app.use((req,res,next)=>{
    res.locals.success = req.flash("success") //success is a key here 
    res.locals.error = req.flash("error") ; 
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
})

// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email: "vikas@gmail.com",
//         username: "its_vikas03"
//     })

//     let registeredUser = await User.register(fakeUser,"Vikas233") //"Vikas233" is a password
//     res.send(registeredUser); 
// })


app.get("/",(req,res)=>{
    res.redirect("/listings");
})
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND"));
})


app.use((err,req,res,next)=>{
    let{statusCode=500,message="SOMETHING WENT WRONG"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs",{err});
})



app.listen("3000",(req,res)=>{
    console.log("app is listening at port : 3000")
})