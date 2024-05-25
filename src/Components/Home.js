import React, { useState, useEffect } from "react";
import clear from "../Assets/pexels-wdnet-96622.jpg";

import rise from "../Assets/clear sky.png";
import cold from "../Assets/snow.png";
import rainImage from "../Assets/rain.jpg";
import Haze from "../Assets/haze.jpg";
import { WiSunset } from "react-icons/wi";
import nightSky from "../Assets/night.jpg";
function Home() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [uvIndex, setUvIndex] = useState(null);
  const [chanceOfRain, setChanceOfRain] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState("");

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

 
  useEffect(() => {
    const currentTime = new Date().getHours(); // Get current hour
    if (currentTime === 18 && new Date().getMinutes() >= 30) { // Check if it's 6:30 PM or later
      setBackgroundImage(nightSky); // Set night sky background
    } else if (
      weatherData &&
      weatherData.weather &&
      weatherData.weather[0].main === "Rain"
    ) {
      setBackgroundImage(rainImage);
    } else {
      setBackgroundImage(
        weatherData && weatherData.main && weatherData.main.temp > 20
          ? clear
          : Haze
      );
    }
  }, [weatherData]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=916a25347dbdf0bfe621cc07988cce54&units=Metric`
    );
    const data = await response.json();
    console.log(data);
    if (data.cod !== 200) {
      alert("Invalid city");
      return;
    }
    setWeatherData(data);
    setWeatherCondition(data.weather[0].main);

    const uvResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=916a25347dbdf0bfe621cc07988cce54`
    );
    const uvData = await uvResponse.json();
    console.log(uvData);
    setUvIndex(uvData.value);

    const oneCallResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=916a25347dbdf0bfe621cc07988cce54=&units=Metric`
    );
    const oneCallData = await oneCallResponse.json();
    console.log(oneCallData);
    if (oneCallData.current) {
      setUvIndex(oneCallData.current.uvi);
    }
    if (oneCallData.hourly) {
      const popValues = oneCallData.hourly.slice(0, 6).map((hour) => hour.pop);
      const averagePop =
        popValues.reduce((acc, val) => acc + val, 0) / popValues.length;
      setChanceOfRain(averagePop);
    }
  };
  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="header">
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              className="city-input"
              placeholder="Enter your location"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit">Search</button>
          </div>
        </form>
      </div>

      <div className="main">
        <div className="row" m-0 p-0>
          <div className="col-lg-8 col-md-12 col-sm-12">
            <div className="Weather-detail">
              {weatherData && (
                <>
                  <div id="detail">
                    <div id="move">
                      <img
                        src={
                          weatherData.main && weatherData.main.temp > 20
                            ? rise
                            : cold
                        }
                        alt="Weather Icon"
                        width={250}
                        height={200}
                        style={{ borderRadius: "50%", marginBottom: "8%" }}
                      />
                    </div>

                    <h2 style={{fontSize:"2rem"}}>{weatherData.name}</h2>
                    <p>
                      Temperature: {weatherData.main && weatherData.main.temp}°C
                    </p>
                    <p>
                      Weather Condition:{" "}
                      {weatherData.weather && weatherData.weather[0].main}
                    </p>
                    <p>
                      Humidity: {weatherData.main && weatherData.main.humidity}%
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12">
            <div className="sunset">
              {weatherData && (
                <div
                  id="sun"
                  style={{
                    color:
                      weatherCondition === "Rain" && screenWidth <= 768
                        ? "white"
                        : "black",
                  }}
                >
                  <WiSunset
                    style={{ width: "40%", height: "40%", cursor: "pointer" }}
                  />
                  <p>
                    Sunset:{" "}
                    {new Date(
                      weatherData.sys.sunset * 1000
                    ).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
            <div className="Wind">
              {weatherData && (
                <>
                  <div
                    id="wind"
                    style={{
                      color:
                        weatherCondition === "Rain" && screenWidth <= 768
                          ? "white"
                          : "black",
                    }}
                  >
                    <p>
                      Wind Speed: {weatherData.wind && weatherData.wind.speed}{" "}
                      m/s
                    </p>
                    <p>
                      Real Feel:{" "}
                      {weatherData.main && weatherData.main.feels_like}°C
                    </p>
                    <p>UV:{uvIndex}</p>
                    <p>
                      Pressure: {weatherData.main && weatherData.main.pressure}{" "}
                      hPa
                    </p>
                    <p>Chance of Rain:{chanceOfRain}%</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
}

export default Home;
