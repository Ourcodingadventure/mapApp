import axios from 'axios'
import React, { useEffect, useState, useCallback } from 'react'
import {
    View, StyleSheet,
    FlatList, RefreshControl
} from 'react-native'
import Screen from '../components/Screen'
import Text from '../components/text/AppText'
import environment from '../config/environment/environment';
import Card from '../components/Card';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import socket from '../config/socket'
import ActivityIndicator from '../components/ActivityIndicator'
import useLocation from '../hooks/useLocation'
import haversine from 'haversine'


export default function HomeScreen({ navigation }) {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [change, setChange] = useState(false);
    const [firstCall, setFirstCall] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const {location} = useLocation();
    const wait = timeout => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => {
            setRefreshing(false)
            setChange(!change);
        });
    }, []);

    const getFeedComplains = async () => {
        if (firstCall) {
            setLoading(true);
            setFirstCall(false)
        }
        try {
            let data = await axios.get(`${environment.baseUrl}/all-complains`);
            setFeed(data.data.complain.reverse().filter(complain=>calculateDistance(complain)));
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getFeedComplains();
        socket.on('complain', () => {
            setChange(!change)
        })

        return () => {
            socket.off('complain')
        }
    }, [change, location])
    
    const calculateDistance = complain => {
        const currentLoc = {latitude:location.latitude, longitude:location.longitude}
        const complainLoc = {latitude:complain.latitude, longitude:complain.longitude}
        const distance = haversine(currentLoc, complainLoc)
        return distance < 15 && complain
    }
    
    const keyExtractor = useCallback((item, index) => item._id.toString(), [])
    return (
        <Screen style={!loading && feed.length > 0 ? styles.container : [styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
            <ActivityIndicator visible={loading} />
            {!loading && feed.length > 0 && <FlatList
                data={feed}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => {
                    return (<Card
                        createdOn={item.createdOn}
                        title={`Organization: ${item.organizationName}`}
                        imageUrl={item.image ? { uri: `${environment.baseUrl}/${item.image}` } : false}
                        subTitle={`Posted by: ${item.name}`}
                        secTitle={`Status: ${item.status}`}
                        issueTitle={item.issueName}
                        Map={item.latitude ? () =>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate('Map', {
                                latitude: item.latitude,
                                longitude: item.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                                postedBy: item.email,
                                organization: item.organizationName,
                                status: `Status: ${item.status}`,
                                organization: `Complain against: ${item.organizationName}`,
                                name: item.name,
                            })}>
                                <MapView
                                    style={styles.map}
                                    initialRegion={
                                        {
                                            latitude: item.latitude,
                                            longitude: item.longitude,
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421
                                        }
                                    }
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
                            : false} />
                    )
                }}
            />
            }
            {!loading && !feed.length && <View style={{ justifyContent: 'center' }}><Text>No complains :)</Text></View>}

        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,

    },
    map: {
        width: '80%',
        height: 70,
        alignSelf: 'center'
    },
})