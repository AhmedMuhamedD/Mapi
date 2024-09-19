'use strict';
let latsp = document.querySelector('#latsp');
let longsp = document.querySelector('#longsp');
let findbtn = document.querySelector('#locateButton');
let resetbtn = document.querySelector('#resetButton');
let count = document.querySelector('#count');
let cont = document.querySelector('#cont');
let cit = document.querySelector('#city');
let local = document.querySelector('#local');

let map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let marker;
let mark = (lat, lng) => {
  clear();
  marker = L.marker([lat, lng]).addTo(map);
};

let clear = function clearMarker() {
  if (marker) {
    map.removeLayer(marker);
    marker = null;
  }
};

let reset = function resetMap() {
  map.setView([0, 0], 2);
  clear();
  latsp.innerHTML = '';
  longsp.innerHTML = '';
  count.innerHTML = '';
  cont.innerHTML = '';
  cit.innerHTML = '';
  local.innerHTML = '';
};
let data = async function fetchCountryData(lat, lng) {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    const data = await response.json();
    console.log(data);
    if (data) {
      const {
        countryName,
        city,
        continent,
        locality,
        localityLanguageRequested,
      } = data;
      count.innerHTML = `${countryName}`;
      cont.innerHTML = `${continent}`;
      cit.innerHTML = `${city}`;
      local.innerHTML = `${locality}`;
    } else {
      text.innerHTML = 'Country information not found.';
    }
  } catch (error) {
    console.error('Error fetching country data:', error);
    text.innerHTML = 'Error fetching country data.';
  }
};

let success = position => {
  const { latitude, longitude } = position.coords;
  map.setView([latitude, longitude], 13);
  mark(latitude, longitude);
  latsp.innerHTML = `${latitude}`;
  longsp.innerHTML = `${longitude}`;
  data(latitude, longitude);
};

let failed = () => {
  alert('Unable to retrieve your location.');
};

let locateMe = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, failed);
  }
};

resetbtn.addEventListener('click', reset);
findbtn.addEventListener('click', locateMe);

map.on('click', function (e) {
  clear();

  const { lat, lng } = e.latlng;
  map.setView([lat, lng], 13);
  marker = L.marker([lat, lng]).addTo(map);
  data(lat, lng);
  console.log(lat, lng);
  latsp.innerHTML = `${lat}`;
  longsp.innerHTML = `${lng}`;
});
