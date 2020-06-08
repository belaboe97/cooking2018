//Requirments


const express = require("express");
const app = express();
const morgan = require("morgan");
const flash = require('connect-flash');
const session = require('express-session'); 
const mongoose = require("mongoose");
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const { ensureAuthenticated } = require('./config/auth');


//Database connection
mongoose.connect('mongodb+srv://test123:test123@cluster0-69ch7.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false);

//Passport config

require('./config/passport')(passport);



const gerichteRoutes = require("./api/routes/gerichte")
const anmeldungenRoutes = require("./api/routes/users")
const uploadRoutes = require("./api/routes/upload");
const accountRoutes = require("./api/routes/account")


//EJS
app.engine('ejs', require('ejs').renderFile);
app.use("/css",express.static(__dirname + "/css"));
app.use("/bilder",express.static(__dirname + "/bilder"))
app.use("/uploads",express.static(__dirname + "/uploads"))
app.set('view engine','ejs')

//Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash()); 

app.use(express.json({
  type: ['application/json', 'text/plain']
}))

//Global Vars -> eigene Middleware
app.use((req,res,next)=>{
  res.locals.succes_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error_msg = req.flash('error_msg')
  next(); 
})


app.get('/rezept', (req, res) => {
    var User = req.user
    console.log(User);
    res.render('rezept', {User: User})
})


//Mogrgan unterstützt Fehlermeldungen in der Konnsole
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));


// CORS HANDLING --> 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});



// Routes die die Request behandeln
app.use("/users", anmeldungenRoutes);
app.use("/gerichte", gerichteRoutes);
app.use("/", gerichteRoutes);
app.use("/upload", ensureAuthenticated, uploadRoutes);
app.use("/account", accountRoutes);
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
