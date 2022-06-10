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

function mktohour(hour , min){
  let n_hour = '';
  let n_min = '';
  if(min == 0){
   n_min = '00';
 }else if(min < 10){
   n_min = '0' + min;
 }else{
   n_min = '' + min;
 }

 if(hour==0){
   n_hour = '00'
 }else if(hour < 10){
  n_hour = '0' + hour;
 }else{
   n_hour = '' + hour;
 }

 return n_hour + ':' + n_min;
}
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
async function findandprint(){
  let docs =  await Schedual.find({}).exec();
  console.log(docs);
}
async function setReservation(info){
  let schedual =  await Schedual.find({}).exec();
  let cur_reserv = await Reserv.find({name: info.name , phone: info.phone}).exec();

  let reserv_id = cur_reserv[0]._id;
  console.log(reserv_id);

  // for (let i=0; i < schedual.length; i++){
  //   let day = schedual[i];
  //
  //
  //   if(day.date.number === info.dayNumber && day.date.month === info.month){
  //     let day_to_update = day;
  //
  //
  //     for (let j=0; j < day_to_update.appointments.length ; j++){
  //       let a = day_to_update.appointments[j];
  //
  //       if(mktohour(a.hour,a.min) == info.hour && a.available == true){
  //         console.log('match found');
  //         a.available = false;
  //         a.reserv_id = reserv_id;
  //         Schedual.updateOne(day , day_to_update);
  //         break;
  //       }
  //     }
  //   }
  // }

}


app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));

// DB setup
const database_name = "reservDB";
mongoose.connect('mongodb://localhost:27017/' + database_name);

const monthSchema = new mongoose.Schema({
  _id: String,
  date: {
    number: String,
    month: String,
  },
  dayName: String,
  appointments: [
    {
      hour: Number,
      min: Number,
      available: Boolean,
      reserv_id: String
    }
  ]
});
const Schedual = mongoose.model('Schedual', monthSchema);
const reservSchema = new mongoose.Schema({
  _id: String,
  name: String,
  phone: String
});
// reservSchema.plugin(encrypt,{secret: process.env.SECRET , encryptedFields: ["password"]});
const Reserv = mongoose.model('Reservation', reservSchema);



var day = new Schedual({
  _id: '1',
  date: {
    number: '6',
    month: 'June'
  },
  dayName: 'Monday',
  appointments: [
    {
      hour: 10,
      min: 00,
      available: true
    },
    {
      hour: 10,
      min: 30,
      available: false
    },
    {
      hour: 11,
      min: 30,
      available: true
    }
  ]

}
);



// day.save(function(err , res){
//   if(err){
//     console.log(err);
//   }
//   console.log(res);
// })








app.route('/')
  .get(async function(req,res){

    // findandprint();

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



    let docs =  await Schedual.find({}).exec();
    console.log(docs[0]);
    res.render("index",{Today: today , Docs: docs});
  })
  .post(async function(req,res){
    let info = req.body;
    var new_reservation = new Reserv({
      _id: String(Math.floor(Math.random() * 10000000)),
      name: info.name,
      phone: info.phone
    });
    console.log(info);
    // new_reservation.save(function(err,result){
    //   if(err){console.log(err);}
    // });

    setReservation(info);

    res.redirect('/');
  });




// listening to a dinamic port (for using heroku) and on our localhost at port 3000
app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000");
});
