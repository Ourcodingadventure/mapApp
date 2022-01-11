import React, { memo, useState, useEffect } from "react";
import {
    View, StyleSheet, TouchableWithoutFeedback, Image,
} from "react-native";
import Text from "./text/AppText";
import colors from "../config/Colors";
import moment from 'moment'
import { TouchableOpacity } from "react-native-gesture-handler";
function Card({ issueTitle, title, subTitle, imageUrl, onPress, thumbnailUrl, Map, createdOn, secTitle }) {
    const [isLiked, setIsLiked] = useState(false)
    const [isDisliked, setIsDisliked] = useState(false)
    const [likesCount, setLikesCount] = useState(0)

    const handleLike = () => {
        try {
            if (!isLiked) {
                setLikesCount(prev=>prev+1)
                setIsLiked(true)
                setIsDisliked(false)   
            } else {
                setIsLiked(false)
                !isDisliked ? likesCount!==0 && setLikesCount(prev=>prev-1): setLikesCount(prev=>prev+1)
            }
        } finally {
        }
    }
    const handleDislike = () => {
        try {
            if (!isLiked) {
                likesCount>0 && setLikesCount(prev=>prev-1)
                likesCount>0 && setIsLiked(true)
                setIsDisliked(true)   
            } else {
                setIsLiked(false)
                !isDisliked ?setLikesCount(prev=>prev-1): likesCount!==0 && setLikesCount(prev=>prev+1)
            }
        } finally {
        }
    }

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
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={{marginRight:8}} onPress={handleLike}>
                            <View><Text>Like <Text>{likesCount}</Text></Text></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDislike}>
                            <View><Text>Dislike</Text></View>
                        </TouchableOpacity>
                    </View>
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