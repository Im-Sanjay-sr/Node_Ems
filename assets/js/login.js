const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btns = document.querySelector("#sign-up-btn");
const containers = document.querySelector(".container");
const signup = document.querySelector("#sign");
const contoun = document.getElementById("countoun");
const otpInbox = document.getElementsByClassName("otp");
const signupName = document.getElementById("signup_name");
const signupEmail = document.getElementById("signup_email");
const signupPassword = document.getElementById("signup_password");
const signinEmail = document.getElementById("singin_email");
const signinPassword = document.getElementById("signin_password");
const container = document.getElementById("container");
const getOtps = document.getElementById("otp_ver");
const otpnotifactions = document.getElementById("otp_notifications");
const getOtp = document.getElementById("sign-btn");
const loginbtn = document.getElementById("loginbtn");

if (sign_in_btn) {
  sign_up_btns.addEventListener("click", () => {
    containers.classList.add("sign-up-mode");
  });

  sign_in_btn.addEventListener("click", () => {
    containers.classList.remove("sign-up-mode");
  });
}

let interval;
var seconds = 60;
var minutes = 30;

// Function to handle OTP timer
const timer = () => {
  var display = contoun; 
  if (minutes < 0) {
    
    otpnotifactions.innerHTML = `<p>Your Otp has expired <a href="#" onclick="">Resend it</p>`; 
    clearInterval(interval); 
    return;
  }
 
  var displayMin = minutes >= 10 ? `${minutes}` : `0${minutes}`;
  var displaySecond = seconds >= 10 ? `${seconds}` : `0${seconds}`;
  
  display.textContent = `${displayMin} : ${displaySecond}`;
  seconds--;
  if (seconds == 0) {
   
    minutes--;
    seconds = 60;
  }
};

// Handling OTP input fields
if (otpInbox) {
  const arr = Array.from(otpInbox); // Converting NodeList to Array
  arr.forEach((element, index) => {
    console.log(element);
    element.addEventListener("keyup", () => {
      console.log(index);
      // Auto-submit the form on the fourth OTP input
      if (index == 3) {
        document.otpForm.submit();
      }
      // Moving focus to the next input field if available
      if (index < arr.length - 1) {
        if (element.value.length == 1) {
          element.nextElementSibling.disabled = false;
          element.nextElementSibling.focus();
        }
      }
    });
  });
}

// Event listener for page load
window.addEventListener("load", () => {
  if (contoun) {
    interval = setInterval(timer, 1000); // Starting the timer interval
  }
  // Handling alert message
  const alert = document.getElementsByClassName("alert")[0];
  if (alert) {
    alert.classList.add("active");
    setTimeout(() => {
      alert.classList.remove("active");
    }, 5000);
  }
});

// Event listener for requesting OTP
getOtp.addEventListener("click", (e) => {
 
  if (!nameVerification(signupName)) {
    e.preventDefault();
  }
  if (!emailValidation(signupEmail)) {
    e.preventDefault();
  }
  if (!passwordVerfication(signupPassword)) {
    e.preventDefault();
  }
});

//Sign in button Validation

loginbtn.addEventListener("click", (e) => {
  if (!emailValidation(signinEmail)) {
    e.preventDefault();
  }
  if (!passwordVerfication(signinPassword)) {
    e.preventDefault();
  }
});

//form validation preventing sumbit if form is empty

const emailValidation = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const emailError = document.getElementById("email_error");

  if (!email.value) {
    email.nextElementSibling.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> This field cant be empty`;
    return false;
  }
  if (!emailRegex.test(email.value)) {
    email.nextElementSibling.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Invalid Email`;
    return false;
  }

  email.nextElementSibling.innerHTML = "";
  return true;
};

const passwordVerfication = (password) => {
  if (!password.value) {
    password.nextElementSibling.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> This field cant be empty`;
    return false;
  }
  if (password.value.length < 6) {
    password.nextElementSibling.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Type atleast 6 characters`;
    return false;
  }

  password.nextElementSibling.innerHTML = "";
  return true;
};

const nameVerification = (name) => {
  const nameRegEx = /^[A-Z]/;
  const nameNumRegEx = /\d/;

  if (!name.value) {
    name.nextElementSibling.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> This field cant be empty`;
    return false;
  }

  if (!nameRegEx.test(name.value)) {
    name.nextElementSibling.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> First letter must be capital`;
    return false;
  }

  if (nameNumRegEx.test(name.value)) {
    name.nextElementSibling.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Number are not allowed `;
    return false;
  }

  name.nextElementSibling.innerHTML = "";
  return true;
};

const formValidation = () => {
  const confirm = true;

  if (!nameVerification(signupName)) {
    confirm = false;
  }
  if (!emailValidation(signupEmail)) {
    confirm = false;
  }
  if (!passwordVerfication(signupPassword)) {
    confirm = false;
  }

  return confirm;
};
