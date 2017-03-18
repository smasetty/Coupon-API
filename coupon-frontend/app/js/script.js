var modal = document.getElementById('js-success');
var form = document.getElementById('js-signup-form');

window.onclick = function(event) {
  if(event.target === modal) modal.style.display = 'none';
}

function submitForm() {
  console.log(form);
}

function error(target){
  target.style.border = '3px solid red';

}

function clearError(target){

}


function validatePhone(target, isRequired) {
  var phone = target.value;
  if (!phone && !isRequired) return '';
  var sanitized = '';
  for (var i = 0; i < phone.length; i++){
    if (!isNaN(phone[i] && phone[i] !== ' '))
      sanitized += phone[i];
  }
  if (sanitized.length != 10){
    error(target);
    return '';
  }
  return sanitized;
}

function validateEmail(target, isRequired){ 
  var email = target.value;
  if(!email && !isRequired) return true;
    // http://emailregex.com/
    var isValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  if (!isValid) error(target);
  return isValid;
}


