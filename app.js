if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user.js");
const Review = require("./models/review.js");

const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');

const ExpressError = require("./utils/express.js");

const listings = require("./routes/listing1.js");
const reviews = require("./routes/review1.js");
const user = require("./routes/user.js");

const dbUrl = "mongodb://127.0.0.1:27017/wanderlust";

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
app.use(express.static(path.join(__dirname, "/public")));


const sessionSecret = process.env.SECRET || 'devsecretfallback';

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: sessionSecret,
  },
  touchAfter: 24 * 3600,
  httpOnly: true,
});


store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOption = {
  store,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.sucess = req.flash('sucess');
  res.locals.error = req.flash('error');
  res.locals.curruser = req.user;
  next();
});

// Routes
app.use("/listing", listings);
app.use("/listing/:id/reviews", reviews);
app.use("/", user);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

// Error handler
app.use((err, req, res, next) => {
  let { status = 500, message = "something wents wrong" } = err;
  res.render("err.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening ${http://localhost:8080}");
});
