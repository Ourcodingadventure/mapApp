import { useEffect, useState } from "react";
import * as Location from "expo-location";

export default useLocation = () => {
  const [location, setLocation] = useState();
  const [fetching, setFetching] = useState();
  const getLocation = async () => {
    setFetching(true);
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return false;
      const {
        coords: { latitude, longitude, altitude },
      } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setLocation({ latitude, longitude, altitude });
    } catch (error) {
      console.log("error", error);
      setLocation(false);
    } finally {
      setFetching(false);
    }
  };
  console.log(fetching);
  useEffect(() => {
    getLocation();

    return () => getLocation();
  }, []);
  return { location, fetching };
};
