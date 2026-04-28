"use strict";

// htmls
const hereBtn = document.querySelector(".here");
const place = document.createElement("div");
const weather = document.createElement("div");
// const text = document.createElement("input");

const hereFunction = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

hereBtn.addEventListener("click", async function () {
  place.innerHTML = "";
  weather.innerHTML = "";

  try {
    const {
      coords: { latitude: ltd },
      coords: { longitude: lng },
    } = await hereFunction();
    // console.log(ltd, lng);
    const myLocation = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${ltd}&lon=${lng}&format=json`,
    );
    const data = await myLocation.json();
    // console.log(data.address.city);

    place.classList.add("place");
    place.innerHTML = data.address.city;
    hereBtn.after(place);

    const weatherData = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${ltd}&longitude=${lng}&hourly=temperature_2m&past_days=0&forecast_days=7`,
    );

    const dataw = await weatherData.json();
    // console.log(
    //   dataw.hourly.temperature_2m[0] + dataw.hourly_units.temperature_2m,
    // );

    weather.classList.add("weather");
    weather.innerHTML =
      dataw.hourly.temperature_2m[0] + dataw.hourly_units.temperature_2m;
    place.after(weather);
  } catch {}
});

// text.classList.add("text-area");
// text.input = "";
