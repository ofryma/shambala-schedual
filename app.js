require('dotenv').config();
const express = require("express");
const https = require("https");
const request = require("request");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const app = express();
app.set('view engine', 'ejs');
const d = new Date();

function getDaysInMonth(monthNumber){
      const d = new Date();
      var year = d.getFullYear();
      daysInMonth = new Date(year, monthNumber + 1, 0).getDate();
      return daysInMonth;
}
function getFirstDayOfMonth(year , monthNumber){
  firstDay = new Date(year, monthNumber, 1).getDay();
  return firstDay;
}

function openMonth(monthNumber){
  // check if this month alredy open
  Schedual.findOne({index: monthNumber} , function(err , result){
    if(err){
      console.log(err);
    }else if(result == null){

    }
  })
}


app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));

// DB setup
const database_name = "reservDB";
mongoose.connect('mongodb://localhost:27017/' + database_name);
const monthSchema = new mongoose.Schema({
  index: Number,
  year: Number,
  day: [
    {
      dayNumber: Number,
      hour: String,
      available: Number,
      userID: String
    }
  ]
});
const Schedual = mongoose.model('Schedual', monthSchema);
const reservSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true
  },
  phone: String,
  time: {
    day: String,
    hour: Number,
    min: Number,
    sec: Number
  }
});
// reservSchema.plugin(encrypt,{secret: process.env.SECRET , encryptedFields: ["password"]});
const Reserv = mongoose.model('Reservation', reservSchema);




app.route('/')
  .get(function(req,res){


    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = new Date();
    let monthNumber = d.getMonth();




    let today = {
      dayName: weekday[d.getDay()],
      dayInWeek: d.getDay(),
      todayDate: d.getDate(),


      monthNumber: monthNumber,
      monthName: month[monthNumber],

      daysInThisMonth: getDaysInMonth(monthNumber),
      daysInNextMonth: getDaysInMonth(monthNumber + 1),

      firstDayOfMonth: getFirstDayOfMonth(d.getFullYear(),monthNumber)
    }


    res.render("index",{
      Today: today
    });
  })
  .post(function(req,res){

  });





// listening to a dinamic port (for using heroku) and on our localhost at port 3000
app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000");
});
