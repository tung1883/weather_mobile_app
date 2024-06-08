import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { useContext  } from "react";
import moment from "moment";

import { FunctionalContext, WeatherContext } from "../Context";
import Sunrise from "../ui/Sunrise";

const moonImages = [
    require('../../assets/moon/moon-new.png'),
    require('../../assets/moon/waxing-crescent.png'),
    require('../../assets/moon/first-quarter.png'),
    require('../../assets/moon/waxing-gibbous.png'),
    require('../../assets/moon/moon-full.png'),
    require('../../assets/moon/waning-gibbous.png'),
    require('../../assets/moon/last-quarter.png'),
    require('../../assets/moon/waning-crescent.png')
]

export default Sun = () => {
    const { weather } = useContext(WeatherContext)
    const { isDarkMode, t} = useContext(FunctionalContext)

    const getTime = (dt) => {
        if (!weather?.timezone_offset) return '00:00'
        let date = (dt) ? new Date(dt * 1000) : new Date()
        let locationTime= new Date(date.getTime() + date.getTimezoneOffset() * 60000 + (1000 * weather.timezone_offset))
        let hour = locationTime.getHours();
        let minutes = locationTime.getMinutes()

        return `${(hour < 10) ? '0' + hour : hour}:${((minutes< 10)) ? '0' + minutes : minutes}`
    }

    const getDate = (dt) => {
        if (!weather?.timezone_offset) return '00:00'
        let date = (dt) ? new Date(dt * 1000) : new Date()
        date= new Date(date.getTime() + date.getTimezoneOffset() * 60000 + (1000 * weather.timezone_offset))
        const day = date.getDate();
        const month = date.getMonth() + 1; 
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
        return `${formattedDay}/${formattedMonth}`;
    }

    const getMoon = (daily, index) => {
        if ((index != 8 && daily[index + 1] > daily[index]) || (index == 8 && daily[index - 1] < daily[index])) {
            if (daily[index].moon_phase == 0) return {name: t('sun.new-moon'), img: 0}
            if (daily[index].moon_phase < 0.5) return {name:  t('sun.waxing-crescent'), img: 1}
            if (daily[index].moon_phase == 0.5) return {name: t('sun.first-quarter'), img: 2}
            if (daily[index].moon_phase < 1) return {name: t('sun.waxing-gibbous'), img: 3}
            if (daily[index].moon_phase == 1) return {name: t('sun.full-moon'), img: 4}
        } else {
            if (daily[index].moon_phase == 0) return {name: t('sun.new-moon'), img: 0}
            if (daily[index].moon_phase < 0.5) return {name: t('sun.waning-crescent'), img: 7}
            if (daily[index].moon_phase == 0.5) return {name: t('sun.last-quarter'), img: 6}
            if (daily[index].moon_phase < 1) return {name: t('sun.waning-gibbous'), img: 5}
            if (daily[index].moon_phase == 1) return {name: t('sun.full-moon'), img: 4}
        }
    }

    return (
        <>
            {weather && 
            <ScrollView>
                <Sunrise></Sunrise>
                <View style={{paddingVertical: 10, justifyContent: 'center', backgroundColor: isDarkMode ? '#696969' : 'rgba(255, 255, 255, 0.6)', 
                    marginHorizontal: 10, marginTop: 40, marginBottom: 30, borderRadius: 20}}>
                    <Text style={{padding: 10, paddingLeft: 20, fontSize: 16, fontWeight: 'bold', color: isDarkMode ? 'white' : 'black'}}>{t('sun.moon').toUpperCase()}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20}}>
                        <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{t('sun.moonrise')} <Text style={{color: '#E9B824'}}>{getTime(weather?.daily[0]?.moonrise)}</Text></Text>
                        <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{t('sun.moonset')} <Text style={{color: '#E9B824'}}>{getTime(weather?.daily[0]?.moonset)}</Text></Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 30, width: '100%'}}>
                        <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, flex: 1}}>
                            <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{t('sun.today')}</Text>
                            <Image source={moonImages[getMoon(weather?.daily, 0).img]} style={{width: 50, height: 50, marginVertical: 5}}></Image>
                            <Text style={{fontSize: 12, color: isDarkMode ? 'white' : 'black'}}>{getMoon(weather?.daily, 0).name}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, flex: 1}}>
                            <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{getDate(weather?.daily[4]?.dt)}</Text>
                            <Image source={moonImages[getMoon(weather?.daily, 4).img]} style={{width: 50, height: 50, marginVertical: 5}}></Image>
                            <Text style={{fontSize: 12, color: isDarkMode ? 'white' : 'black'}}>{getMoon(weather?.daily, 4).name}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, flex: 1}}>
                            <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{getDate(weather?.daily[7]?.dt)}</Text>
                            <Image source={moonImages[getMoon(weather?.daily, 7).img]} style={{width: 50, height: 50, marginVertical: 5}}></Image>
                            <Text style={{fontSize: 12, color: isDarkMode ? 'white' : 'black'}}>{getMoon(weather?.daily, 7).name}</Text>
                        </View>
                    </View>
                </View>
                {
                    weather?.daily?.map((day, index) => {
                        return (
                            <View key={index} 
                                style={{flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 10, backgroundColor: isDarkMode ? '#696969' : 'rgba(255, 255, 255, 0.6)', 
                                    marginVertical: 10, alignItems: 'center', borderRadius: 10}
                            }>
                                <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
                                    <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{getDate(day?.dt)}</Text>
                                    <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{moment(day.dt * 1000).format("ddd")}</Text>
                                </View>
                                <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
                                    <Text style={{color: '#E9B824'}}>{t('sun.sunrise')}</Text>
                                    <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{getTime(day?.sunrise)}</Text>
                                </View>
                                <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
                                    <Text style={{color: '#E9B824'}}>{t('sun.sunset')}</Text>
                                    <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{getTime(day?.sunset)}</Text>
                                </View>
                                <View style={{paddingVertical: 10, paddingHorizontal: 10}}>
                                    <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{t('sun.moon')}</Text>
                                    <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{getMoon(weather?.daily, index).name}</Text>
                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>}          
          {!weather && <View style={styles.noWeather}><Text style={{color: 'white', textAlign: 'center'}}>No Weather to Show</Text></View>}
        </>
    )
}

const styles = StyleSheet.create({
    noWeather: {
        flexGrow: 1
    }, 
    futureForecastContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    currentView: {
        width: '100%',
    },
    secondaryInfoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        display: 'flex',
        margin: 10,
        marginHorizontal: 10,
        width: '95%',
        maxWidth: 478,
    }
})
