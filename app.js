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

function validatePhone(phone_number){

  return phone_number;
}
function arrangeCard(list){
  // arrange by hours
  for(let j=0 ; j < 30*4 ; j++){
    for(let i=0; i<list.length-1 ; i++){
        if(Number(list[i].hour[0] + list[i].hour[1])>Number(list[i+1].hour[0] + list[i+1].hour[1])){
          list = swap(i,i+1,list);
        }
    }

  }
  // arrange by days:
  for(let j=0 ; j < 30*4 ; j++){
    for(let i=0; i<list.length -1 ; i++){
        if(Number(list[i].dayNumber)>Number(list[i+1].dayNumber)){
          list = swap(i,i+1,list);
        }
    }

  }

  return list;
}
function swap(i,j,list){
  let temp = list[j];
  list[j] = list[i];
  list[i] = temp;
  return list;
}
function getTodayData(){
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const d = new Date();
  let this_month = month[d.getMonth()];
  let this_day = weekday[d.getDay()];
  let this_year = String(d.getFullYear());

  let today = {
    day: this_day,
    month: this_month,
    year: this_year
  }
  return today
}
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
async function deleteByDate(d_day,d_month){
  Schedual.deleteOne({date: {number: d_day , month: d_month}}, function(err){
    if(err){console.log(err);}
  })
}
async function findandprint(){
  let docs =  await Reserv.find({}).exec();
  docs.forEach(function(doc){
    console.log(doc);
  })
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

// const monthSchema = new mongoose.Schema({
//   day: String,
//   hours: [String]
// });
// const Schedual = mongoose.model('Schedual', monthSchema);
const reservSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  dayNumber: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  hour: {
    type: String,
    required: true
  }
});
// reservSchema.plugin(encrypt,{secret: process.env.SECRET , encryptedFields: ["password"]});
const Reserv = mongoose.model('Reservation', reservSchema);



app.get('/admin' ,async function(req,res){
  // all the object in this list of docs
  // are for the current month
  let today = getTodayData();
  let docs =  await Reserv.find({month: today.month}).exec();
  arrangeCard(docs);
  res.render('admin',{Docs: docs});

})

app.route('/')
  .get(async function(req,res){
    // findandprint();
    let d = new Date();
    let today_data = getTodayData()
    let monthNumber =d.getMonth();

    let today = {
      dayName: today_data.day,
      dayInWeek: d.getDay(),
      todayDate: d.getDate(),


      monthNumber: monthNumber,
      monthName: today_data.month,

      daysInThisMonth: getDaysInMonth(monthNumber),
      daysInNextMonth: getDaysInMonth(monthNumber + 1),

      firstDayOfMonth: getFirstDayOfMonth(d.getFullYear(),monthNumber)
    }



    // let docs =  await Schedual.find({}).exec();
    res.render("index",{Today: today});
  })
  .post(async function(req,res){
    let info = req.body;

    info.phone = validatePhone(info.phone);
    var reservation = new Reserv({
      name: info.name,
      phone: info.phone,
      day: info.day,
      dayNumber: info.dayNumber,
      month: info.month,
      hour: info.hour
    });
    Reserv.find({
      dayNumber: reservation.dayNumber,
      month: reservation.month,
      hour: reservation.hour
      } ,function(err,result){
        if(result.length == 0){
          reservation.save(function(err,result){
            if(err){
              console.log('משהו קרה, הרישום לא הושלם בהצלחה' , err);
            }
            else{
              console.log('הרישום בוצע בהצלחה');
            }
          });
        }
    })

    res.redirect('/');
  });




// listening to a dinamic port (for using heroku) and on our localhost at port 3000
app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000");
});
