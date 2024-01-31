import { useState } from 'react';
import './App.css'
import { useEffect } from 'react';
import axios from 'axios';
import Weather from './components/Weather';
const APIkey = "a574a33f4da0964a1324d7448cc6049d";

function App() {
  
  const [coords, setCoords] = useState();
  const [weather, setWeater] = useState();
  const [temp, setTemp] = useState();
  const [isLoading, setIsLoading] = useState(true)
  const [textInput, setTextInput] = useState("")
  const [finder, setFinder] = useState()
  const [hasError, setHasError] = useState(false)
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, [])
  
  const success = position =>{
    // console.log(position);
    const obj = {
      lati: position.coords.latitude,
      long: position.coords.longitude,
    }
    setCoords(obj)
  }
  
  useEffect(() => {
    if(coords){
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lati}&lon=${coords.long}&appid=${APIkey}`;
      axios.get(url)
        .then(res => {
          const obj = {
            celcius: (res.data.main.temp - 275.15).toFixed(2),
            fahrenheit: ((res.data.main.temp - 275.15) * (9/5) + 32).toFixed(2),
          }
          setHasError(false)
          setTemp(obj)
          setWeater(res.data)
        })
        .catch(err => {
          setHasError(true)
          console.log(err)
        })
        .finally(() =>{
          setIsLoading(false)
        })
    }
  }, [coords]);

  useEffect(() => {
    if(textInput){
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${textInput}&appid=${APIkey}`
        axios.get(url)
          .then(res => {
            const obj = {
              celcius: (res.data.main.temp - 275.15).toFixed(2),
              fahrenheit: ((res.data.main.temp - 275.15) * (9/5) + 32).toFixed(2),
            }
            setHasError(false)
            setTemp(obj)
            setFinder(res.data)
          })
          .catch(err => {
            setHasError(true)
            console.log(err)
          })
    }
  }, [textInput])
  
  console.log(finder)

  return (
    <div className='app'>
      {
        isLoading ?
          <h2>Loading...</h2>
          :
          textInput ?
            <Weather 
              weather = {finder}
              temp = {temp}
              setTextInput ={setTextInput}
              hasError = {hasError}
            />
            :
            <Weather 
            weather = {weather}
            temp = {temp}
            setTextInput ={setTextInput}
            hasError = {hasError}
            />
      }


    </div>
    )
}

export default App
