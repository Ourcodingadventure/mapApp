import React, { memo, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import Text from "./text/AppText";
import colors from "../config/Colors";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import environment from "../config/environment/environment";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function Card({
  issueTitle,
  title,
  subTitle,
  imageUrl,
  onPress,
  thumbnailUrl,
  Map,
  createdOn,
  secTitle,
  id,
  count,
  remarks,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  console.log("count", count);
  useEffect(() => {
    setLikesCount(count);
  }, [count]);
  const handleLike = async () => {
    try {
      if (!isLiked) {
        setLikesCount((prev) => prev + 1);
        setIsLiked(true);
        setIsDisliked(false);
      } else {
        setIsLiked(false);
        !isDisliked
          ? likesCount !== 0 && setLikesCount((prev) => prev - 1)
          : setLikesCount((prev) => prev + 1);
      }
      await updateLikes();
    } finally {
    }
  };
  const handleDislike = async () => {
    try {
      if (!isLiked) {
        likesCount > 0 && setLikesCount((prev) => prev - 1);
        likesCount > 0 && setIsLiked(true);
        setIsDisliked(true);
      } else {
        setIsLiked(false);
        !isDisliked
          ? setLikesCount((prev) => prev - 1)
          : likesCount !== 0 && setLikesCount((prev) => prev + 1);
      }
      await updateLikes();
    } finally {
    }
  };
  const updateLikes = async () =>
    axios.post(`${environment.baseUrl}/update-likes`, { id, likesCount });
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.flexBetween}>
          <Text style={styles.subTitle} numberOfLines={2}>
            {subTitle}
          </Text>
          <Text style={styles.issue}>{issueTitle}</Text>
        </View>

        <View style={styles.division2}></View>

        {remarks != "" && <Text style={styles.remarks}>- '{remarks}'</Text>}

        {imageUrl && (
          <Image
            style={styles.image}
            source={{ uri: imageUrl.uri, method: "get" }}
          />
        )}

        {Map && <Map />}

        <View style={styles.flexBetween}>
          <Text style={styles.title} numberOfLines={2}>
            {moment(createdOn).fromNow()}
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity onPress={handleDislike}>
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons name="heart-broken" color="rgb(254,40,105)" size={25}/>
                <Text style={{color: "#4838AD"}}>0 </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginRight: 8 }} onPress={handleLike}>
              <View style={{flexDirection: "row"}}>
                <MaterialCommunityIcons name="heart" color="rgb(254,40,105)" size={25} />
                <Text style={{color: "#4838AD"}}>{` ${likesCount}`}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* {secTitle && (
          <Text style={styles.title} numberOfLines={1}>
            {secTitle}
          </Text>
        )} */}
        <View style={styles.division}></View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingTop: 10,
    overflow: "hidden",
    backgroundColor: colors.semiTransparentWhite,
    width: "97%",
    alignSelf: "center",
    borderRadius: 15,
    marginBottom: 5,
  },
  flexBetween: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingRight: 30,
    paddingLeft: 30,
  },
  issue: {
    color: colors.white,
    backgroundColor: colors.darkPurple,
    padding: 10,
    paddingRight: 13,
    paddingLeft: 13,
    borderRadius: 30,
    fontSize: 15,
  },
  remarks: {
    // color: colors.white,
    color: colors.darkPurple,
    fontSize: 17,
    fontStyle: "italic",
    fontWeight: "700",
    marginBottom: 15,
    paddingRight: 30,
    paddingLeft: 30,
  },
  image: {
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
    marginRight: 30,
    marginLeft: 30,
  },
  subTitle: {
    // color: colors.white,
    color: colors.darkPurple,
    fontSize: 17,
    fontWeight: "bold",
  },
  title: {
    // color: colors.white,
    color: colors.darkPurple,
    fontSize: 17,
  },
  division: {
    marginBottom: 10,
    backgroundColor: colors.barelySeenWhite,
    height: 1,
    width: "100%",
  },
  division2: {
    marginBottom: 10,
    backgroundColor: colors.purpleTransparent,
    height: 1,
    width: "100%",
  },
});

export default memo(Card);
