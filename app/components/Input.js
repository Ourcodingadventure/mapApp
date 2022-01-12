import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import colors from "../config/Colors";
import { EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function SearchInput({
  inputContainerStyle,
  CustomIcon,
  inputStyle,
  onChangeText,
  iconName,
  iconSize = 25,
  color = "rgba(255,255,255, 0.6)",
  iconStyle,
  placeholder = "",
  value,
  ...otherProps
}) {
  const [showIcon, setShowIcon] = React.useState(true);
  const [secureTextEntry, setSecureTextEntry] = useState(
    otherProps.secureTextEntry
  );
  return (
    <View style={[styles.container, inputStyle, inputContainerStyle]}>
      {showIcon && iconName && (
        <EvilIcons
          name={iconName}
          size={iconSize}
          color={color}
          style={[styles.icon, iconStyle]}
        />
      )}
      {showIcon && CustomIcon && <CustomIcon />}
      <TextInput
        placeholder={placeholder}
        style={[styles.input, inputStyle]}
        onChangeText={onChangeText}
        onBlur={() => setShowIcon(true)}
        onFocus={() => setShowIcon(false)}
        value={value}
        {...otherProps}
        placeholderTextColor="lightgrey"
        secureTextEntry={secureTextEntry}
      />
      {otherProps.secureTextEntry && (
        <TouchableWithoutFeedback
          onPress={() => setSecureTextEntry(!secureTextEntry)}
          style={{
            justifyContent: "flex-end",
            alignSelf: "flex-end",
            alignItems: "flex-end",
          }}
        >
          {secureTextEntry ? (
            <MaterialCommunityIcons
              name="eye-off"
              size={iconSize}
              color={color}
              style={[
                styles.icon,
                iconStyle,
                { paddingRight: 5, paddingLeft: 0 },
              ]}
            />
          ) : (
            <MaterialCommunityIcons
              name="eye"
              size={iconSize}
              color={color}
              style={[
                styles.icon,
                iconStyle,
                { paddingRight: 5, paddingLeft: 0, justifyContent: "flex-end" },
              ]}
            />
          )}
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingLeft: 10,
    height: 150,
    marginLeft: 30,
    marginRight: 30,
    color: colors.black,
    marginBottom:15,
  },
  input: {
    width: "100%",
    paddingLeft: 10,
    color: colors.black,
    fontWeight: "500",
    fontSize: 17,
    flex: 1,
  },
  icon: {
    alignSelf: "center",
    fontWeight: "500",
  },
});
