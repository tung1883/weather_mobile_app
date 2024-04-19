import TodayWeather from "../weather/TodayWeather"
import Forecast from "../weather/Forecast"
import Precip from "../weather/Precip"
import Sun from "../weather/Sun"

export default WeatherPage = ({currentSection, setCurrentSection, navigation}) => {
    switch (currentSection) {
        case 0: return <TodayWeather setCurrentSection={setCurrentSection} navigation={navigation}></TodayWeather>
        case 1: return <Forecast></Forecast>
        case 2: return <Precip></Precip>
        case 4: return <Sun></Sun>
        default: return <TodayWeather setCurrentSection={setCurrentSection}/>
    }
}