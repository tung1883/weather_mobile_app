import TodayWeather from "../weather/TodayWeather"
import Forecast from "../weather/Forecast"
import { sectionList } from "./Footer"
import { useEffect } from "react"
import Precip from "../weather/Precip"

export default WeatherPage = ({currentSection}) => {
    switch (currentSection) {
        case 0: return <TodayWeather></TodayWeather>
        case 1: return <Forecast></Forecast>
        case 2: return <Precip></Precip>
        default: return <></>
    }
}