/** @format */

import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import Screen from '../components/Screen';
import Text from '../components/text/AppText';
import environment from '../config/environment/environment';
import Card from '../components/Card';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import socket from '../config/socket';
import ActivityIndicator from '../components/ActivityIndicator';
import useLocation from '../hooks/useLocation';
import haversine from 'haversine';
import H3 from '../components/text/H3';
import Colors from '../config/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Loader from '../components/Loader';

export default function HomeScreen({ navigation }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [firstCall, setFirstCall] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { location } = useLocation();
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => {
      setRefreshing(false);
      setChange(!change);
    });
  }, []);

  const getFeedComplains = async () => {
    if (firstCall) {
      setLoading(true);
      setFirstCall(false);
    }
    try {
      let data = await axios.get(`${environment.baseUrl}/all-complains`);
      setFeed(
        data.data.complain
          .reverse()
          .filter((complain) => calculateDistance(complain))
      );
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getFeedComplains();
    socket.on('complain', () => {
      setChange(!change);
    });

    return () => {
      socket.off('complain');
    };
  }, [change, location]);

  const calculateDistance = (complain) => {
    const currentLoc = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    const complainLoc = {
      latitude: complain.latitude,
      longitude: complain.longitude,
    };
    const distance = haversine(currentLoc, complainLoc);
    return distance < 15 && complain;
  };

  useEffect(() => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
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

    let ordinal = ['th', 'st', 'nd', 'rd', ''][selector];
    setCurrentDate(`${month} ${day}${ordinal} ${year}`);
  }, []);

  const keyExtractor = useCallback((item, index) => item._id.toString(), []);
  return (
    <Screen
      style={
        !loading && feed.length > 0
          ? styles.container
          : [
              styles.container,
              { alignItems: 'center', justifyContent: 'center' },
            ]
      }
    >
      {loading && <Loader source={require('../assets/giphy.gif')} />}
      {!loading && feed.length > 0 && (
        <>
          <H3 style={styles.header}>FEED</H3>

          <View style={styles.dateLocationWrapper}>
            <View style={styles.flexBetween}>
              <Text style={styles.date}>{currentDate}</Text>
              <View style={styles.flexStart}>
                <MaterialCommunityIcons
                  name='map-marker'
                  color='white'
                  size={25}
                />
                <Text style={styles.date}>15km</Text>
              </View>
            </View>
          </View>

          <View style={styles.division}></View>
          <FlatList
            data={feed}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyExtractor={keyExtractor}
            renderItem={({ item }) => {
              {
                console.log(item);
              }
              return (
                <Card
                  id={item._id}
                  remarks={item.remarks}
                  count={item.likesCount}
                  createdOn={item.createdOn}
                  imageUrl={item.image && item.image}
                  subTitle={`By: ${item.name}`}
                  secTitle={`Status: ${item.status}`}
                  issueTitle={item.issueName}
                  Map={
                    item.latitude
                      ? () => (
                          <TouchableWithoutFeedback
                            onPress={() =>
                              navigation.navigate('Map', {
                                latitude: item.latitude,
                                longitude: item.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                                postedBy: item.email,
                                organization: item.organizationName,
                                status: `Status: ${item.status}`,
                                organization: `Complain against: ${item.organizationName}`,
                                name: item.name,
                              })
                            }
                          >
                            <MapView
                              style={styles.map}
                              initialRegion={{
                                latitude: item.latitude,
                                longitude: item.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                              }}
                            >
                              <Marker
                                coordinate={{
                                  latitude: item.latitude,
                                  longitude: item.longitude,
                                }}
                                description={`Status: ${item.status}`}
                                title={`Complain against: ${item.organizationName}`}
                              />
                            </MapView>
                          </TouchableWithoutFeedback>
                        )
                      : false
                  }
                />
              );
            }}
          />
        </>
      )}
      {!loading && !feed.length && (
        <View style={{ justifyContent: 'center' }}>
          <Text style={{ color: 'white' }}>No complains :)</Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.purple,
  },
  map: {
    borderRadius: 30, //not working :(
    height: 100,
    marginBottom: 20,
    marginRight: 30,
    marginLeft: 30,
  },
  header: {
    color: Colors.white,
    marginTop: 25,
    marginLeft: 30,
    fontSize: 20,
    letterSpacing: 3,
  },
  date: {
    color: Colors.white,
    letterSpacing: 1,
  },
  dateLocationWrapper: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
  },
  division: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: Colors.barelySeenWhite,
    height: 1,
    width: '100%',
  },
  flexStart: {
    flexDirection: 'row',
  },
  flexBetween: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
