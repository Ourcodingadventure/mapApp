import axios from 'axios'
import React, { useEffect, useState, useCallback } from 'react'
import {
    View, StyleSheet,
    FlatList, Platform, Dimensions, Alert, RefreshControl
} from 'react-native'
import Screen from '../components/Screen'
import Text from '../components/text/AppText'
import environment from '../config/environment/environment';
import ProfileCard from '../components/ProfileCard';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import socket from '../config/socket'
import ActivityIndicator from '../components/ActivityIndicator'

export default function MyComplainsScreen({ navigation }) {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [change, setChange] = useState(false);
    const [firstCall, setFirstCall] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [feedbackActivity, setFeedbackActivity] = useState();

    const [refreshing, setRefreshing] = useState(false);
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




    useEffect(() => {
        getFeedComplains();
        socket.on('complain', () => setChange(!change))
        return () => {
            socket.off('complain')
        }
    }, [change])

    const getFeedComplains = async () => {
        try {
            if (firstCall) {
                setLoading(true);
            }
            let data = await axios.get(`${environment.baseUrl}/my-complains`);
            setFeed(prev => {
                prev = data.data.complain.reverse()
                return prev;
            });
        } catch (err) {
            console.log('err', err.response)
        } finally {
            setLoading(false);
            setFirstCall(false);

        }
    }

    const deleteRequest = async (id) => {
        try {
            await axios.post(`${environment.baseUrl}/delete-complain`, {
                id: id,
            });
        } catch (err) {
            console.log('err', err.response.data.message)
        }
    }

    const submitFeeback = async (id, feedback) => {
        try {
            await axios.post(`${environment.baseUrl}/feedback-complain`, {
                id: id,
                feedback
            });
            setFeedbackActivity(false)
            Alert.alert('Feedback given', 'thankyou for your feedback')
        } catch (err) {
            console.log('err', err.response.data.message)
            setFeedbackActivity(false)
        }
    }

    const keyExtractor = useCallback((item, index) => item._id.toString(), [])
    return (
        <View style={styles.container}>
            <ActivityIndicator visible={loading} />
            {!loading && feed.length > 0 && <FlatList
                data={feed}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => {
                    return (<ProfileCard
                        loading={feedbackActivity}
                        deleteRequest={id => deleteRequest(id)}
                        onFeedbackChange={text => setFeedback(text)}
                        createdOn={item.createdOn}
                        onSubmitFeeback={submitFeeback}
                        feedback={feedback}
                        id={item._id}
                        title={`Organization: ${item.organizationName}`}
                        imageUrl={item.image ? { uri: `${environment.baseUrl}/${item.image}` } : false}
                        subTitle={`Posted by: ${item.name}`}
                        status={item.status}
                        complaintFeedback={item.feedback || item.feedback !== 'null' ? item.feedback : false}
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
                                            latitudeDelta: 0.0922,
                                            longitudeDelta: 0.0421
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
            {!loading && !feed.length && <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><Text>No complains :)</Text></View>}

        </View>
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