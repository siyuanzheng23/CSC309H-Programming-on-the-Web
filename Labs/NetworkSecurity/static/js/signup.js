$(document).ready(function() {
  var beta_code = document.getElementById('beta_code');

  beta_code.addEventListener('keyup', function(event) {
    if (beta_code.validity.patternMismatch || !beta_code.value) {
      // Set native validationMessage using JavaScript Validation API.
      // More info: http://www.w3schools.com/js/js_validation_api.asp
      beta_code.setCustomValidity('Please get a valid beta sign-up code from the Bananama founders to register.');
    } else {
      beta_code.setCustomValidity('');
    }
  });
});
