import { useEffect, useState } from 'react'
import axios from 'axios'

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const capital = country.capital[0]
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: capital,
          appid: apiKey,
          units: 'metric'
        }
      }
    ).then(response => {
      setWeather(response.data)
    })
  }, [capital, apiKey])

  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>Capital: {capital}</p>
      <p>Area: {country.area}</p>

      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang =>
          <li key={lang}>{lang}</li>
        )}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />

      {weather && (
        <>
          <h2>Weather in {capital}</h2>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </>
      )}
    </div>
  )
}

export default CountryDetails