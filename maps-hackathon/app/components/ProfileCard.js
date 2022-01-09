import React, { memo } from "react";
import {
    View, StyleSheet, TouchableWithoutFeedback, Image, ActivityIndicator
} from "react-native";
import Text from "./text/AppText";
import colors from "../config/Colors";
import moment from 'moment'
import Button from '../components/Button'
import Colors from "../config/Colors";
import Input from '../components/Input';


function Card({ title, subTitle, imageUrl, onPress, thumbnailUrl, Map, createdOn, status, deleteRequest, id, complaintFeedback, onFeedbackChange, feedback, loading, onSubmitFeeback }) {

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.card}>
                {imageUrl && <Image
                    style={styles.image}
                    source={{ uri: imageUrl.uri }}
                />}
                {Map && <Map />}
                <View style={styles.detailsContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.title} numberOfLines={1}>
                            {title}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.subTitle} numberOfLines={2}>
                            {subTitle}
                        </Text>
                        <Text style={styles.subTitle} numberOfLines={2}>
                            {moment(createdOn).fromNow()}
                        </Text>
                    </View>

                    {status === 'pending' && <Button
                        title='Cancel Complain'
                        style={{ backgroundColor: 'white', position: 'relative', top: 15 }}
                        buttonFontStyle={{ color: Colors.primaryLight, fontWeight: '600' }}
                        onPress={() => deleteRequest(id)}
                    />}
                    {
                        loading ? <ActivityIndicator color={colors.primary} /> :

                            status === 'resolved' && (!complaintFeedback || complaintFeedback === 'null') ?
                                <View>
                                    <Input
                                        placeholder='Feedback about complaint'
                                        value={feedback}
                                        onChangeText={e => onFeedbackChange(e)}
                                    />
                                    <Button
                                        title='Submit'
                                        style={{ width: '60%', alignSelf: 'center' }}
                                        onPress={() => onSubmitFeeback(id, feedback)}
                                    />
                                </View>
                                : <React.Fragment />}
                </View>
                <View>

                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}


const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        backgroundColor: colors.white,
        marginBottom: 20,
        overflow: "hidden",
    },
    detailsContainer: {
        padding: 20,
    },
    image: {
        width: "100%",
        height: 200,
        marginBottom: 20,
    },
    subTitle: {
        color: colors.primaryLight,
        fontWeight: "bold",
    },
    title: {
        marginBottom: 7,
    },

});



export default memo(Card);