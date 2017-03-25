var modal = document.getElementById('js-success');
//var form = document.getElementById('js-signup-form');
var form = document.forms[0];
 
window.onclick = function(event) {
  if(event.target === modal) modal.style.display = 'none';
}

function submitLogin() {
  var errorMessage = '';

  if (!form.email.value) {
    error(form.email);
    errorMessage += 'Missing email!';
  }

  if (!form.password.value) {
    error(form.password);
    if (errorMessage) errorMessage +='<br />';
    errorMessage += 'Missing Password!!';
  }
  
  if (errorMessage) return displayMessage(errorMessage);
}

function submitForm() {
  displayMessage('');
  var errorMessage = false;

  if (!validatePhone(form.phone, true)) {
    error(form.phone);
    errorMessage = 'Missing/Invalid Phone Number'
  }
  
  if (!validateEmail(form.email, false)){
    error(form.email);
    errorMessage += '<br /> Missing Email'
  }
    
  if(errorMessage) {
    displayMessage(errorMessage);
    return;
  } 

  var data = {
    phone: form.phone.value,
    phoneProvider: form.phoneProvider.value
  };

  fetch('/', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data)
  }).then(submitSuccess)
  .catch(submitError);

  console.log("Done submitting the form to the API server");
}

function error(target){
  target.style.border = '3px solid red';

}

function clearError(target){
  target.style.border=''
}

function clearForm() {
  form.reset();
  clearError(form.js-error-message);
  var divs = document.getElementsByClassName('hidden');
  for (var i = 0; i < divs.length; i++)
    divs[i].style.display ='';
}

function submitSuccess(res) {
  if(!res.ok) return submitError(res);
  modal.style.display = 'block';
  clearForm();
}

function submitError(res, message) {
  if (res.status >= 400 && res.status <= 500)
    //return res.text().then(function(message) {displayMessage(message)});
     //res.text().then(function(message) {displayMessage(message)});
    res.text();
  if (message)
    return displayMessage(message);
  return displayMessage('There was an error with the form, please try again later.');
}

function displayMessage(message){
  var errorDiv = document.getElementById('js-error-message');
  errorDiv.innerHTML = message;
  errorDiv.style.visibility = 'visible';
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

function validateProvider(isRequired) {
  var target = form.phoneProvider;
  clearError(target);
  if(target.value === 'other'){
    if (form['other-provider'].style.display === 'none'){
      form['other-provider'].style.display = 'inline-block';
      return false;
    }
    else {
      if (!form['other-provider'].value) {
        error(form['other-provider']);
        return false;
      }
      else
        return true;
    }
  }
  else {
    form['other-provider'].style.display = 'none';
    if (target.value === 'null' && isRequired) {
      error(target);
      return false;
    }
    return true;
  }
}

