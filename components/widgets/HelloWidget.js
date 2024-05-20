import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function HelloWidget() {

  const getGpsLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();

        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return null;
        }

        const { latitude: lat, longitude: long } = (await Location.getCurrentPositionAsync({})).coords
        const {city, country} = await getLocationDetails({lat, long})
        return { lat, long, city, country }
      } catch (error) {
        console.error('Error getting location:', error);
        return null
      }
    }

  const getLocationByCity = async (city) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${config.API_KEY}`
      );
      const data = await response.json();
      if (!data?.coord?.lat) {
        console.log('getLocationByCity Error');
        return null
      }

      const {lat, lon: long} = data.coord
      const details = await getLocationDetails({lat, long})
      return {lat, long, city: details.city, country: details.country}
    } catch (error) {
      console.error('getLocationByCity Error:', error);
      return null
    }
  };

   const getLocationDetails = async ({lat, long}) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=1&appid=${config.API_KEY}`
      );
      const data = (await response.json()).sort((a, b) => b.name.length - a.name.length)
      return {city: data[0].name, country: data[0].country}
    } catch (error) {
      console.error('Error fetching location info:', error);
    }
  };

  const getWeather = async ({location, current}) => {
    //TRUE API CALL
    if (!location) return null

    return fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.long}&exclude=minutely&units=${unit}&lang=${parsedLang(lang.lang)}&appid=${config.API_KEY}`,
      { signal }
    )
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      return data
    })
    .catch((err) => {
      console.log("error", err);
      return null
    });
  }

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
      }}
    >
      <TextWidget text={location.city}></TextWidget>
    </FlexWidget>
  );
}