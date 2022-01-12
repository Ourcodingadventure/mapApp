/** @format */
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  ScrollView,
  Text,
  Image,
} from "react-native";
import { weatherApi } from "../config/environment/environment.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useLocation from "../hooks/useLocation.js";
import H3 from "../components/text/H3";
import Colors from "../config/Colors";

export default function WeatherScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [weather, setWeather] = useState("");
  const [humidity, setHumidity] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [temp, setTemp] = useState(null);
  const [tempMarker, setTempMarker] = useState("");
  const [expectedTempMarker, setExpectedTempMarker] = useState("");
  const [place, setPlace] = useState("");
  const [icon, setIcon] = useState(null);
  const [wind, setWind] = useState({});
  const { location } = useLocation();
  const [currentDate, setCurrentDate] = useState("");

  const fetchWeather = async (lat, long) => {
    await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=ee674281ee3c34d6364f35e597682a6c&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsLoading(false);
        setPlace(data.name);
        setHumidity(data.main.humidity);
        setWeather(data.weather[0].description);
        setIcon(data.weather[0].icon);
        setWind(data.wind);

        var newTemp = String(data.main.temp).slice(0, 2);
        setTemp(newTemp);

        var newTempFeelsLike = String(data.main.feels_like).slice(0, 2);
        setFeelsLike(newTempFeelsLike);

        if (data.main.temp > 0) {
          setTempMarker("+");
        } else {
          setTempMarker("-");
        }

        if (data.main.feels_like > 0) {
          setExpectedTempMarker("+");
        } else {
          setExpectedTempMarker("-");
        }
      });
  };

  useEffect(() => {
    setIsLoading(true);
    location && fetchWeather(location.latitude, location.longitude);
  }, [location]);

  useEffect(() => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date();
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let selector;
    if (day <= 0) {
      selector = 4;
    } else if ((day > 3 && day < 21) || day % 10 > 3) {
      selector = 0;
    } else {
      selector = day % 10;
    }

    let ordinal = ["th", "st", "nd", "rd", ""][selector];
    setCurrentDate(`${month} ${day}${ordinal} ${year}`);
  }, []);

  return (
    <>
      {isLoading ? (
        <View>
          <Text>Fetching the weather</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.flexBetween}>
            <H3 style={styles.header}>PROFILE</H3>
            <View style={styles.flex}>
              <MaterialCommunityIcons
                name="map-marker"
                color="white"
                size={25}
              />
              <Text style={styles.text}>{place}</Text>
            </View>
          </View>
          <View style={styles.division}></View>
          <Text style={styles.date}>{currentDate}</Text>
          <View style={styles.flexBetweenNoPadding}>
            <Image
              style={styles.image}
              source={{
                uri: `http://openweathermap.org/img/wn/${icon}@2x.png`,
              }}
              // resizeMode="contain"
            ></Image>
            <View style={styles.flexColumn}>
              <Text style={styles.temp}>{`${tempMarker}${temp}°`}</Text>
              <Text
                style={styles.expectedTemp}
              >{`Feels like: ${expectedTempMarker}${feelsLike}°`}</Text>
            </View>
          </View>
          <View style={styles.whiteContainer}>
            <Text style={styles.message}>
              "You are so much sunshine in every square inch!"
            </Text>
            <View style={styles.weatherContainer}>
              <Text style={styles.weather}>
                {" "}
                Current temperature: {tempMarker}
                {temp}°
              </Text>
              <Text style={styles.weather}>
                {" "}
                Feels like: {expectedTempMarker}
                {feelsLike}°
              </Text>
              <Text style={styles.weather}> Expecting: {weather}</Text>
              <Text style={styles.weather}> Humidity: {humidity}%</Text>
              <Text style={styles.weather}> Wind speed: {wind.speed}km/h</Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.purple,
    height: "100%",
    paddingTop: 45,
  },
  whiteContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: "100%",
    height: "100%",
    marginTop: 115,
  },
  flexBetween: {
    backgroundColor: Colors.purple,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 30,
    paddingLeft: 30,
    height: 60,
  },
  flexBetweenNoPadding: {
    backgroundColor: Colors.purple,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 30,
    paddingTop: 60,
    height: 60,
  },
  header: {
    color: Colors.white,
    fontSize: 20,
    letterSpacing: 3,
    fontWeight: "700",
  },
  image: {
    marginTop: 35,
    width: 200,
    height: 120,
    marginLeft: 10,
  },
  division: {
    backgroundColor: Colors.barelySeenWhite,
    height: 1,
    width: "100%",
  },
  flex: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  flexColumn: {
    alignItems: "flex-start",
    flexDirection: "column",
    paddingLeft: 20,
  },
  text: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1,
  },
  date: {
    color: Colors.white,
    letterSpacing: 1,
    fontSize: 16,
    paddingLeft: 30,
    paddingTop: 15,
  },
  temp: {
    paddingTop: 30,
    color: Colors.white,
    fontSize: 40,
    paddingLeft: 15,
  },
  expectedTemp: {
    color: Colors.white,
    fontSize: 17,
  },
  message: {
    margin: 30,
    marginTop: 50,
    backgroundColor: Colors.purple,
    fontSize: 18,
    color: Colors.white,
    letterSpacing: 1,
    padding: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    lineHeight: 25,
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: "flex-start",
    marginLeft: 80,
  },
  weather: {
    marginBottom: 25,
    fontSize: 19,
    color: "grey",
  },
});
