const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-area"),
infoTxt = inputPart.querySelector(".info-text"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
arrowBack = wrapper.querySelector("header i"),
wIcon = wrapper.querySelector(".weather-part img");
let api;
const key = "8cca9e3b6164034830268229558768d7";


inputField.addEventListener("keyup", e=> {
   if(e.key == "Enter" && inputField.value!="") {
      requestApi(inputField.value);
   }
});

locationBtn.addEventListener("click", ()=> {
   if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
   }
   else {
      alert("Your browser does not support geolocation API");
   }
});

function onSuccess(position) {
   const {latitude, longitude} = position.coords;
   api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}`;
   fetchData();
}

function onError(error) {
   infoTxt.innerText = error.message;
   infoTxt.classList.add("error"); 
}

function requestApi(city) {
   api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
   fetchData();
}

function fetchData() {
   infoTxt.innerText = "Getting weather details..";
   infoTxt.classList.add("pending");
   fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
   if(info.cod == "404") {
      infoTxt.classList.replace("pending", "error");
      infoTxt.innerText = `${inputField.value} isn't a valid city name`;
   }
   else {

      const city = info.name;
      const country = info.sys.country;
      const {description, id} = info.weather[0];
      const {feels_like, humidity, temp} = info.main;
      
      if(id == 800) {
         wIcon.src = "./weather-app-icons/Weather Icons/clear.svg"
      }  
      else if(id >= 200 && id <= 232) {
         wIcon.src = "./weather-app-icons/Weather Icons/storm.svg"
      }
      else if(id >= 600 && id <= 622) {
         wIcon.src = "./weather-app-icons/Weather Icons/snow.svg"
      }
      else if(id >= 701 && id <= 781) {
         wIcon.src = "./weather-app-icons/Weather Icons/haze.svg"
      }
      else if(id >= 801 && id <= 804) {
         wIcon.src = "./weather-app-icons/Weather Icons/cloud.svg"
      }  
      else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
         wIcon.src = "./weather-app-icons/Weather Icons/rain.svg"
      }

      wrapper.querySelector(".temp .numb").innerText =Math.floor(temp);
      wrapper.querySelector(".weather").innerText = description;
      wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
      wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
      wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

      inputField.value = "";
      infoTxt.classList.remove("pending");
      wrapper.classList.add("active");
      console.log(info);
   }
}

arrowBack.addEventListener("click", () => {
   wrapper.classList.remove("active");
});