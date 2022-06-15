function getDaysInMonth(monthNumber){
      const d = new Date();
      var year = d.getFullYear();
      daysInMonth = new Date(year, monthNumber + 1, 0).getDate();
      return daysInMonth;
}
function getTodayData(){
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const d = new Date();

  let day_num = d.getDay();
  let month_num = d.getMonth();
  let day_in_month = d.getDate();
  let this_month = month[month_num];
  let this_day = weekday[day_num];
  let this_year = String(d.getFullYear());

  let today = {
    day: this_day,
    dayNumber: String(day_num),
    dayInMonth: day_in_month,
    month: this_month,
    monthNumber: String(month_num),
    year: this_year
  }
  return today
}
function monthName(monthNumber){
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return month[monthNumber];

}
function getFirstDayOfMonth(year , monthNumber){
  firstDay = new Date(year, monthNumber, 1).getDay();
  return firstDay;
}
function add_one(){
  let monthNumber = document.getElementById("cur_month");
  let yearNumber = Number(document.getElementById("year-title").innerHTML);
  let new_monthNumber = Number(monthNumber.innerHTML)+1;
  if(new_monthNumber > 11){
    new_monthNumber = 0;
    yearNumber++;
  }
  monthNumber.innerHTML = String(new_monthNumber);
  plotCalender(new_monthNumber,yearNumber);
}
function sub_one(){
  let monthNumber = document.getElementById("cur_month");
  let yearNumber = Number(document.getElementById("year-title").innerHTML);
  let new_monthNumber = Number(monthNumber.innerHTML)-1;
  if(new_monthNumber < 0){
    new_monthNumber = 11;
    yearNumber--;
  }
  monthNumber.innerHTML = String(new_monthNumber);
  plotCalender(new_monthNumber,yearNumber);
}
function plotCalender(monthNumber,year){
  document.getElementById("month-title").innerHTML = monthName(monthNumber);
  document.getElementById("year-title").innerHTML = String(year);
  let board = document.getElementById("calender-board");
  var count = 0;
  var new_html = '';
  let firstDay = getFirstDayOfMonth(year, monthNumber);
  for(let i =0 ; i < firstDay ; i++){
      new_html = new_html + '<th class=""></th>';
      count++;
  }

  var dayInThisMonth = getDaysInMonth(monthNumber);

  for( let i=1 ; i < dayInThisMonth + 1 ; i++){
    if(count==7){
      count=0;
    }
    if(count==0){
      new_html = new_html + '</tr><tr scope="row">'
    }

    new_html = new_html + '<div class="day-container"><th class=""><h4 class="days'
    let today = getTodayData();

    if(String(today.dayInMonth) == String(i) && today.monthNumber == String(monthNumber) && today.year == year){
      new_html = new_html + ' today" ';
    }else{
      new_html = new_html + '" ';
    }
    new_html = new_html + 'href="">' + i + '</h4></th></div>'
    count++;
  }

  board.innerHTML = new_html;
  eventListeners();

}
function checkDay(dayNumber,month,year){
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let today = getTodayData();
  let day_string = month + ' ' + dayNumber + ', ' + year + ' 01:15:00';
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
  let main_form = document.getElementById('main-form');
  main_form.classList.remove('hidden');

  let dayNumber_input = document.getElementById('dayNumber-input');
  let dayName_input = document.getElementById('dayName-input');
  let month_input = document.getElementById('month-input');

  dayNumber_input.value = day_number;
  month_input.value = document.getElementById('month-title').innerHTML;
  dayName_input.value = checkDay(day_number);

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

  //
  // let main_form = document.getElementById('main-form');
  // main_form.classList.remove('hidden');

  let dayNumber_input = document.getElementById('dayNumber-input');
  let dayName_input = document.getElementById('dayName-input');
  let month_input = document.getElementById('month-input');

  dayNumber_input.value = day_number;
  let c_day = checkDay(day_number,document.getElementById('month-title').innerHTML,document.getElementById('year-title').innerHTML);
  dayName_input.value = c_day;
  month_input.value = document.getElementById('month-title').innerHTML;




  let day_hours = dayHours(c_day);
  let hour_selection = document.getElementById('hour-select');
  // console.log(hour_selection);
  let hour_string = '';
  day_hours.forEach(function(hour){
    hour_string = hour_string + '<option class="hour">' + hour + '</option>';
  })
  hour_selection.innerHTML = hour_string;


}
function closeForm() {
  document.getElementById("popupForm").style.display = "none";
}
function setTitle(month,year,monthNumber){
  document.getElementById('month-title').innerHTML = month;
  document.getElementById('year-title').innerHTML = year;
  document.getElementById('cur_month').innerHTML = monthNumber;
}
function eventListeners(){
  days_links_list = document.getElementsByClassName('days');
  for(let i=0 ; i < days_links_list.length ; i++){
    days_links_list[i].addEventListener("click" , function(){
      // showForm(Number(days_links_list[i].innerHTML));
      openForm(Number(days_links_list[i].innerHTML));

    })
  }
}

let today = getTodayData();
setTitle(today.month,today.year,today.monthNumber);
plotCalender(today.monthNumber , today.year);
eventListeners();
