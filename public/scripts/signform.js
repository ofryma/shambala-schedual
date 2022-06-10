


function showForm(day_number){

  console.log('form showed' , day_number);
  main_form = document.getElementById('main-form');
  main_form.classList.remove('hidden');
}

function hideForm(){

}


days_links_list = document.getElementsByClassName('days');

for(let i=0 ; i < days_links_list.length ; i++){
  days_links_list[i].addEventListener("click" , function(){
    showForm(Number(days_links_list[i].innerHTML));
  })
}
