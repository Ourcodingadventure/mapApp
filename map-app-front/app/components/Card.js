import React, { memo } from "react";
import {
    View, StyleSheet, TouchableWithoutFeedback, Image,
} from "react-native";
import Text from "./text/AppText";
import colors from "../config/Colors";
import moment from 'moment'
function Card({ issueTitle, title, subTitle, imageUrl, onPress, thumbnailUrl, Map, createdOn, secTitle }) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.card}>
                {imageUrl && <Image
                    style={styles.image}
                    source={{ uri: imageUrl.uri, method: 'get' }}
                />}
                {Map && <Map />}
                <View style={styles.detailsContainer}>
                    <Text style={{ alignSelf: 'center', marginBottom: 5, fontWeight: '500' }}>{issueTitle}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.title} numberOfLines={1}>
                            {title}
                        </Text>
                        {secTitle &&
                            <Text style={styles.title} numberOfLines={1}>
                                {secTitle}
                            </Text>
                        }

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.subTitle} numberOfLines={2}>
                            {subTitle}
                        </Text>
                        <Text style={styles.subTitle} numberOfLines={2}>
                            {moment(createdOn).fromNow()}
                        </Text>
                    </View>

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