/** @format */

import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Button,
  ScrollView,
  Text,
  Image,
} from 'react-native';
import { weatherApi } from '../config/environment/environment.js';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WeatherScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [weather, setWeather] = useState('');
  const [humidity, setHumidity] = useState('');
  const [feelsLike, setFeelsLike] = useState('');
  const [temp, setTemp] = useState(null);
  const [place, setPlace] = useState('');
  const [icon, setIcon] = useState(null);
  const [wind, setWind] = useState({});

  const fetchWeather = async (lat, long) => {
    await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=ee674281ee3c34d6364f35e597682a6c
&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsLoading(false);
        setPlace(data.name);
        setFeelsLike(data.main.feels_like);
        setTemp(data.main.temp);
        setHumidity(data.main.humidity);
        setWeather(data.weather[0].description);
        setIcon(data.weather[0].icon);
        setWind(data.wind);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      fetchWeather(position.coords.latitude, position.coords.longitude);
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <View>
          <Text>Fetching the weather</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <Text>weather in {place}</Text>
          <Text> temperature {temp}</Text>
          <Text>feels like {feelsLike}</Text>
          <Text> humidity {humidity}</Text>
          <Text> {weather}</Text>
          <Text> wind speed {wind.speed}</Text>
          <Text> humidity {humidity}</Text>
          <Image
            style={styles.image}
            source={{ uri: `http://openweathermap.org/img/wn/${icon}@2x.png` }}
          ></Image>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    padding: 25,
    width: 200,
    height: 220,
  },
});
