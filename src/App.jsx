import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import SelectCity from './components/SelectCity';
import CardPolution from './components/CardPolution';

function App() {
  const [highAccuracyStatus, setHighAccuracy] = useState(false);//The user will be given the option to take their geoposition with the highest precision. Although you will be shown a warning, since doing this "COSTS MORE".
  const [options, setOptions] = useState({enableHighAccuracy: highAccuracyStatus, timeout: 5000, maximumAge: 0});//Geolocation Options

  const [showMain, setShowMain] = useState(true);
  const [canLocate, setCanLocate] = useState();//If the user does not allow me to access their geoposition, a text will be displayed.
  const [canLocateMoreInfo, setCanLocateMoreInfo] = useState();//Adittional Info.

  const [latitude, setLatitude] = useState();//Latitude.
  const [longitude, setLongitude] = useState();//Longitude.
  const [accuracy, setAccuracy] = useState();//The precision in meters.
  const [tempUnitCelcius, setTempUnitCelcius] = useState(true);//The temp in celsius.
  const [data, setUpdateData] = useState({});//'data' is used to display, render information.
  let updateData = {};//Here we save the Climate data and use it to FORCE reload of the component.

  const handleGetData = () => {
    showScreenLd();//We show the loading screen.

    if(document.querySelector(".countrySelecter").value == "" || document.querySelector(".citySelecter").value == ""){//If there is no country or city selected, we use the user's location:
      navigator.geolocation.getCurrentPosition(success, error, options);
    }else{
          //We consult the API:
          const country = document.querySelector(".countrySelecter").value;
          const city = document.querySelector(".citySelecter").value;
          const urlCity = `https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`;
          const apiKeyApiNinja = 'QTCJJuke7DpEzmI+BI1Ddg==oJjLAPCsHW0KlyGu';//La API KEY de mi cuenta en Api Ninja .

          //Primero hay que obtener las coordenadas de la ciudad:
          axios.get(urlCity, {method: 'GET', headers: { 'x-api-key': apiKeyApiNinja}})//Aqui Obtenemos los datos del clima.
              .then((res) => {
                setLatitude((res.data[0].latitude).toFixed(4));
                setLongitude((res.data[0].longitude).toFixed(4));
                setAccuracy(undefined);

                //Ahora obtenemos los datos del clima.
                const apiKeyOpenWeather = 'ecb848c475588dd0bb0f464e16bf1005';//La API KEY de mi cuenta en OpenWeather.
                const urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${res.data[0].latitude}&lon=${res.data[0].longitude}&appid=${apiKeyOpenWeather}`;
                axios.get(urlWeather)
                    .then(axiosSuccess)
                    .catch(axiosError);//If we get troubles getting the weather data.
              })
              .catch(axiosError);//If we get troubles getting the weather data.
    }
  };
  
  const handleChangeTemp = () => {
    setTempUnitCelcius(!tempUnitCelcius);//Turn Celsius to Farenheit and viceverse
  };

  const handleHighPrecision = () => {
    setHighAccuracy(!highAccuracyStatus);//Enable/Disable HighAccuracy
  };

  useEffect(() => {//We will start with a loading screen until the components are ready. It only runs once.
    document.querySelector(".loadingScreen").classList.add("hidden");
  }, []);

  useEffect(() => {
    setOptions({enableHighAccuracy: highAccuracyStatus, timeout: Infinity, maximumAge: 0});
  }, [highAccuracyStatus]);

  /* GEOLOCATION METHODS */
  function success(pos){//Success Funtion:
    const apiKey = 'ecb848c475588dd0bb0f464e16bf1005';//The KEY API in OpenWeather.
    const crd = pos.coords;//We obtain the Coordinates.
  
    setLatitude(crd.latitude);//Get Latitude.
    setLongitude(crd.longitude);//Get Longitude.
    setAccuracy(crd.accuracy.toFixed(1));//We obtain the Accuracy range.
  
    //We consult the API:
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=${apiKey}`;
  
    axios.get(url)
        .then(axiosSuccess)
        .catch(axiosError);//If we get troubles getting the weather data.
  }

  function error(err){
    //Error Function:
    if(err.code == 1){
      setCanLocate(`Access to location was denied.`);
      setCanLocateMoreInfo(`If you want to try again you may need to reload the page due to the browser's "Privacy and Security" settings. If the problem persists, try changing this setting in your browser.`);
    }

    console.warn(`ERROR(${err.code}): ${err.message}`);
    
    hideScreenLd();//We hide the loading screen.
  }

  /* AXIOS METHODS */
  function axiosSuccess(res){
      //We save the data in an object type variable called 'data':
      updateData['main_temp'] = Math.floor((res.data.main.temp - 273.15).toFixed(0));//We pass it to Celsius.
      updateData['main_feels_like'] = (res.data.main.feels_like - 273.15).toFixed(1);//We pass it to Celsius and round it to 1 decimal with 'toFixed()'.
      updateData['main_temp_min'] = (res.data.main.temp_min - 273.15).toFixed(1);//We pass it to Celsius and round it to 1 decimal with 'toFixed()'.
      updateData['main_temp_max'] = (res.data.main.temp_max - 273.15).toFixed(1);//We pass it to Celsius and round it to 1 decimal with 'toFixed()'.

      updateData['main_humidity'] = res.data.main.humidity;//The humidity of the environment.
      updateData['main_pressure'] = res.data.main.pressure;//The Precision.
      
      updateData['city'] = res.data.name;//City Name.
      updateData['country'] = res.data.sys.country;//Country Acronym.
      updateData['timezone'] = res.data.timezone / 3600;//The offset in milliseconds with respect to UTC.
      updateData['visibility'] = res.data.visibility / 1000; //Visibility in Kilometers.
      
      updateData['sunrise'] = new Date(res.data.sys.sunrise * 1000).toLocaleTimeString("default"); //Visibility in Kilometers.
      updateData['sunset'] = new Date(res.data.sys.sunset * 1000).toLocaleTimeString("default"); //Visibility in Kilometers.

      updateData['weather_description'] = res.data.weather[0].description;//Description of the Climate.
      updateData['weather_description_main'] = res.data.weather[0].main;//Short description of the Climate.
      updateData['weather_icon'] = "https://openweathermap.org/img/wn/" + res.data.weather[0].icon + "@2x.png";//The image corresponding to the weather.
      
      updateData['wind_speed'] = res.data.wind.speed;//The WindSpeed.
      updateData['wind_deg'] = res.data.wind.deg;//The wind direction in degrees.
      
      updateData['clouds'] = res.data.clouds.all;//The % of clouds.

      updateData['dateNow'] = new Date().toLocaleDateString('default', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      setShowMain(false);//We now have the data, we can remove the loading and display it.

      hideScreenLd();//We hide the loading screen.

      setUpdateData(data => ({
            ...data,
            ...updateData
      }));
  }
  
  function axiosError(err){
    console.log(err); alert("Datos no disponibles");

    hideScreenLd();//We hide the loading screen.
  }

  return (
    <>
      <div className='cardsContainer'>
        {
          showMain ? //Escamos en el Main, the user just landed into de website.
            <div className='card'>
              <>
                <img src="https://static.vecteezy.com/system/resources/previews/024/984/082/original/3d-weather-forecast-icons-summer-sun-with-thunderstorm-and-strong-wind-3d-illustration-png.png" alt="weather-image" className='mainWeatherImg  pngShadow'/>
                
                <div className='title_app'>
                  <h1>Weather</h1>
                  <h1>App</h1>
                </div>

                <button className='button' onClick={handleGetData}>Get Data</button>

                <div className='container'>
                  <label htmlFor="inputPrecision" className='checkPrecision__label'>Use High Level Precision</label>
                  <input type="checkbox" name='inputPrecision' onClick={handleHighPrecision}/>
                </div>

                {
                  canLocate ?
                    <>
                      <p className='errorMessage'>{canLocate}</p>
                      <p className='errorMessageAditional'>{canLocateMoreInfo}</p>
                    </>
                  :
                  ""
                }
              </>
            </div>
          ://The user ask for the data. 
            <>
              <CardPolution 
              latitude = {latitude}
              longitude = {longitude}
              apiKey = 'ecb848c475588dd0bb0f464e16bf1005'
              />  

              <div className='card'>
                <div className='title'>
                  <p className='title_location'><i className='bx bx-current-location' ></i> {data.city}, {data.country}</p>
                  <p className='title_date'>{data.dateNow}</p>
                </div>
                <div className='mainData'>
                  <div className='mainData_Hero'>
                    {
                      tempUnitCelcius ?
                        <h1 className='pTemperature'>{data.main_temp}°</h1>
                      :
                        <h1 className='pTemperature'>{((data.main_temp * 9 / 5) + 32).toFixed(0)}°</h1>
                    }
                    <div className='mainData_Hero_description'>
                      <h2>{data.weather_description_main}</h2>
                      <img src={data.weather_icon} alt="weather icon"  className='weatherIcon pngShadow'/>
                    </div>
                  </div>
                  <div className='mainData_info'>
                    <section className='mainData_info__section'>
                      <div className='data_container'>
                        <p><i className='bx bxs-droplet'></i></p>
                        <p>{data.main_humidity}%</p>
                        <p>Humidity</p>
                      </div>
                      <div className='data_container'>
                        <p><i className='bx bxs-stopwatch'></i></p>
                        <p>{data.main_pressure}hPa</p>
                        <p>Pressure</p>
                      </div>
                      <div className='data_container'>
                        <p><i className='bx bxs-cloud' ></i></p>
                        <p>{data.clouds}%</p>
                        <p>Clouds</p>
                      </div>
                    </section>
                    <section className='mainData_info__section'>
                      <div className='data_container'>
                        <p><i className='bx bxs-thermometer'></i></p>
                        {
                          tempUnitCelcius ?
                            <p>{data.main_temp_min}°C</p>
                          :
                            <p>{((data.main_temp_min * 9 / 5) + 32).toFixed(1)}°F</p>
                        }
                        <p>Min</p>
                      </div>
                      <div className='data_container'>
                        <p><i className='bx bxs-thermometer bx-sm'></i></p>
                        {
                          tempUnitCelcius ?
                            <p>{data.main_feels_like}°C</p>
                          :
                            <p>{((data.main_feels_like * 9 / 5) + 32).toFixed(1)}°F</p>
                        }
                        <p>Feels Like</p>
                      </div>
                      <div className='data_container'>
                        <p><i className='bx bxs-thermometer'></i></p>
                        {
                          tempUnitCelcius ?
                            <p>{data.main_temp_max}°C</p>
                          :
                            <p>{((data.main_temp_max * 9 / 5) + 32).toFixed(1)}°F</p>
                        }
                        <p>Max</p>
                      </div>
                    </section>
                    <section className='mainData_info__section'>
                      <div className='data_container'>
                        <p><i className='bx bx-wind' ></i></p>
                        <p>{data.wind_speed}m/s</p>
                        <p>Wind Speed</p>
                      </div>
                      <div className='data_container'>
                        <p><i className='bx bx-wind' ></i></p>
                        <p>{data.wind_deg}°</p>
                        <p>Wind Degrees</p>
                      </div>
                    </section>
                    <p className='paragraphInfo'>You are {data.timezone}h away from the UTC(Greenwich, UK)</p>
                    <table>
                      <tbody>
                        <tr>
                          <th>Latitude:</th>
                          <td>{latitude} °</td>
                        </tr>
                        <tr>
                          <th>Longitude:</th>
                          <td>{longitude} °</td>
                        </tr>
                        {
                          accuracy ? //Cuando se trata de una ciudad y no de la ubicacion del usuario, no se obtiene el dato ACCURACY.
                            <tr>
                              <th>Accuracy:</th>
                              <td>{accuracy} mts</td>
                            </tr>
                          :
                          ""
                        }
                        <tr>
                          <th>Sunrise🌅:</th>
                          <td>{data.sunrise}</td>
                        </tr>
                        <tr>
                          <th>Sunset🌇:</th>
                          <td>{data.sunset}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button className='button' onClick={handleChangeTemp}>Change C° - F°</button>
                </div>
              </div>
            </>
        }
      </div>
        
      {/*The Section where the user chooses the country and city*/}
      <SelectCity 
        button = {handleGetData}
      />
    </>
  )
}

function hideScreenLd(){
  //Hide Loading Screen
  document.querySelector(".loadingScreen").classList.add("hidden");
}

function showScreenLd(){
  //Show Loading Screen
  document.querySelector(".loadingScreen").classList.remove("hidden");
}



//Exporting Settings
export default App;
