import React, { useState } from 'react';
import * as Google from "expo-google-app-auth";


const useGoogleLogin = () => {

    const [googleUser, setGoogleUser] = useState(false);
    const [googleError, setGoogleError] = useState(false);
    const [res, setResponse] = useState(false);
    const signInAsync = async () => {

        try {
            const { type, user } = await Google.logInAsync({
                iosClientId: `741318734454-8cvrbl0mu13cv2i55cvti7v8mq53p0gh.apps.googleusercontent.com`,
                androidClientId: `750855626973-b0f2a705nm9hnc9p5v5sea0vpeh0fm9t.apps.googleusercontent.com`,
                androidStandaloneAppClientId: `750855626973-b0f2a705nm9hnc9p5v5sea0vpeh0fm9t.apps.googleusercontent.com`,
            });

            if (type === "success") {
                setGoogleUser(user);
                setResponse(true);
            }
            if (type === 'cancel') {
                setGoogleError(!googleError)
            }
        } catch (error) {
            setGoogleError(error)
        } finally {
            setGoogleError(!googleError)
        }
    };
    return { signInAsync, googleError, googleUser, res, setResponse, setGoogleUser }

}

export default useGoogleLogin;