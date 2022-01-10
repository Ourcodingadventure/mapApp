import { Platform, StyleSheet } from "react-native";

import colors from "./Colors";

export default {
    colors,
    text: {
        color: colors.primary,
        fontSize: 16,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    },
};

const authStyle = StyleSheet.create({
    btnLabel: {
        textAlign: 'center',
        marginBottom: 6,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    formContainer: {
        padding: 30,
        paddingTop: 2,
        flex: 1,
        justifyContent: 'center',
    },
    headerContainer: {
        marginHorizontal: 10,
        backgroundColor: colors.primary,
    },
    headerText: {
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 35,
        color: 'white',
    },
    text: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: "500",
    },

    registerBtn: {
        alignSelf: 'center',
        width: '90%',
        justifyContent: 'flex-end',
        padding: 30,
        width: '90%',
    },
    organizationContainer: {
        marginTop: 5,
        flexDirection: 'row',
        display: 'flex',
        marginBottom: 20
    },
    active: {
        backgroundColor: 'white',

    },
    btnLabelText: { color: colors.primary, fontWeight: "600" },
})

export {
    authStyle
}