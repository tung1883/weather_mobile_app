import { LineChart } from "react-native-chart-kit";
import React, { useContext } from "react";
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons} from '@expo/vector-icons';
import moment from "moment";

import { FunctionalContext, WeatherContext } from "../Context";

export default PrecipInterface = ({setCurrentSection}) => {
    const { isDarkMode, t } = useContext(FunctionalContext)
    const { weather } = useContext(WeatherContext) 

    return (
        <View style={styles.currentView}>
            <View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={[{marginHorizontal: 20, fontSize: 20, fontWeight: 'bold'}, {color: 'white'}]}>{t('today.rain')}</Text>
                <TouchableOpacity 
                    style={{marginRight: 12, flexDirection: 'row', alignItems: 'center'}}
                    onPress={() => { setCurrentSection(2) }}    
                >
                    <Text style={{color: (isDarkMode) ? 'dodgerblue' : '#2D5DA1', fontWeight: 'bold'}}>{t('health.viewmore')}</Text>
                    <MaterialCommunityIcons name={'chevron-right'} color={(isDarkMode) ? 'dodgerblue' : '#2D5DA1'} size={20} style={{paddingTop: 3}}/>
                </TouchableOpacity>
            </View>
            {
                weather?.daily?.map &&
                <LineGraph 
                    isDarkMode={isDarkMode}
                    labels={weather?.daily?.map((day) => (moment(day.dt * 1000).format("ddd")))}
                    data={weather?.daily?.map((day) => (day?.rain) ? day?.rain : 0)}
                >
                </LineGraph>
            }
        </View>
    );
}

const LineGraph = ({data, labels}) => {
    return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <LineChart
                data={{
                    datasets: [{data}],
                    labels: labels
                }}
                width={Dimensions.get("window").width - 20}
                height={260}
                yAxisSuffix={'mm'}
                chartConfig={{
                    backgroundGradientFrom: '#1D5D9B',
                    backgroundGradientTo:'#75C2F6',
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: "3"
                    }
                }}
                fromZero={true}
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    currentView: {
        width: '100%',
        marginTop: 6
    },
    secondaryInfoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        display: 'flex',
        margin: 10,
        marginHorizontal: 10,
        width: '95%',
        maxWidth: 478,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
