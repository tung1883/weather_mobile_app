import { useContext } from 'react';
import { ActivityIndicator, Dimensions } from 'react-native';
import { WeatherContext } from '../Context';

const { width } = Dimensions.get('window');

export default Indicator = () => {
    const {fetching} = useContext(WeatherContext)

    return <>
        {fetching && <ActivityIndicator color='white' style={{position: 'absolute', top: 30, left: width /2 - 15 }} size={30}/>}
    </>
}