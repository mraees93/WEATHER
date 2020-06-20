var options = {
    bottom: '1px',
    right: 'unset', // default: '32px'
    left: '1px', // default: 'unset'
    time: '0.2s', // default: '0.3s'
    mixColor: '#fff', // default: '#fff'
    backgroundColor: '#fff',  // default: '#fff'
    buttonColorDark: '#100f2c',  // default: '#100f2c'
    buttonColorLight: '#fff', // default: '#fff'
    saveInCookies: false, // default: true,
    label: '🌓', // default: ''
    onHoverAddText:'click for dark mode',
    autoMatchOsTheme: true // default: true
  }

  const darkmode = new Darkmode(options);
darkmode.showWidget();





// this is to stop the form  from submitting, hence prevent reloading the page
// grab the value which is contained in the search field

// SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME 
// ALONG WITH THE COUNTRY CODE (e.g. athens,gr)
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

// created variable for the api key
const apiKey = "fa59dc5d5734baf91887ba21f472328b";

// add event listener for the submit button
form.addEventListener("submit", e => {
    e.preventDefault();
    let inputVal = input.value;
    
    
   
    
//1
// check if theres already a city
const listItems = list.querySelectorAll(".ajax-section .city");
const listItemsArray = Array.from(listItems);
 
if (listItemsArray.length > 0) {
  //2
  const filteredArray = listItemsArray.filter(el => {
    let content = "";
    //athens,gr
    if (inputVal.includes(",")) {
      //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
      if (inputVal.split(",")[1].length > 2) {
        inputVal = inputVal.split(",")[0];
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      } else {
        content = el.querySelector(".city-name").dataset.name.toLowerCase();
      }
    } else {
      //athens
      content = el.querySelector(".city-name span").textContent.toLowerCase();
    }
    return content == inputVal.toLowerCase();
  });
   
  //3
  if (filteredArray.length > 0) {
    msg.textContent = `You already know the weather for ${
      filteredArray[0].querySelector(".city-name span").textContent
    } ...otherwise be more specific by providing the country code as well 😉`;
    form.reset();
    input.focus();
    return;
  }
}

// ajax here
const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;


fetch(url)
    .then(response => response.json())
    .then(data => {
        // do stuff with the data. then function is to make callbacks to the server
    // building the list item component.
    // with the ajax request in place, each time we type a city in the search field, 
    // the API will return its weather data, if they are available.
    const { main, name, sys, weather } = data;
    const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;
    
    const li = document.createElement("li");
    li.classList.add("city");
    const markup = `
    <h2 class="city-name" data-name="${name},${sys.country}">
    <span>${name}</span>
    <sup>${sys.country}</sup>
    </h2>
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup>
    </div>
    <figure>
    <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}">
    <figcaption>${weather[0]["description"]}</figcaption>
    </figure>
    `;
    li.innerHTML = markup;
    list.appendChild(li);
    })
    .catch(() => {
        msg.textContent = "Please search for a valid city";
        // catch function deals with rejected cases such as not entering a city name etc.
    });
    
 // clear the content of the .msg element, the value of the search field 
// and give focus to that field as well
msg.textContent = "";
form.reset();
input.focus();   
});






