

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
function checkDay(dayNumber){
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let today = getTodayData();
  let day_string = today.month + ' ' + dayNumber + ', ' + today.year + ' 01:15:00';
  // console.log(day_string);
  d = new Date(day_string);
  // console.log(weekday[d.getDay()]);
  return weekday[d.getDay()];
}

function dayHours(dayName){
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var hours = [];
  if(dayName==weekday[1]){
    hours = ['10:00' , '11:00' , '12:00' , '13:00' ];
  }
  if(dayName==weekday[3]){
    hours = ['16:00' , '17:00' , '18:00' , '19:00' ];
  }
  if(dayName==weekday[5]){
    hours = ['10:00' , '11:00' , '12:00' , '13:00' ];
  }
  return hours;
}

function showForm(day_number){
  main_form = document.getElementById('main-form');
  dayNumber_input = document.getElementById('dayNumber');
  dayName_input = document.getElementById('dayName');
  main_form.classList.remove('hidden');
  dayNumber_input.value = day_number;
  let c_day = checkDay(day_number)
  dayName_input.value = c_day;
  let day_hours = dayHours(c_day);
  hour_selection = document.getElementById('hour-select');
  // console.log(hour_selection);
  let hour_string = '';

  day_hours.forEach(function(hour){
    hour_string = hour_string + '<option class="hour">' + hour + '</option>';
  })
  hour_selection.innerHTML = hour_string;


}

function hideForm(){

}

function openForm(day_number) {
  document.getElementById("popupForm").style.display = "block";
  let dayNumber_input = document.getElementById('dayNumber');
  console.log(dayNumber_input);
  dayNumber_input.value = day_number;

  let dayName_input = document.getElementById('dayName');
  let c_day = checkDay(day_number);
  console.log(c_day);
  dayName_input.value = c_day;


  let day_hours = dayHours(c_day);
  let hour_selection = document.getElementById('hour-select');
  // console.log(hour_selection);
  let hour_string = '';
  day_hours.forEach(function(hour){
    hour_string = hour_string + '<option class="hour">' + hour + '</option>';
  })
  hour_selection.innerHTML = hour_string;


}


days_links_list = document.getElementsByClassName('days');

for(let i=0 ; i < days_links_list.length ; i++){
  days_links_list[i].addEventListener("click" , function(){
    // showForm(Number(days_links_list[i].innerHTML));
    openForm(Number(days_links_list[i].innerHTML));

  })


}
