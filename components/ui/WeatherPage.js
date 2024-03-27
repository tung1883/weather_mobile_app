import TodayWeather from "../weather/TodayWeather"
import { sectionList } from "./Footer"
import { useEffect } from "react"

export default WeatherPage = ({currentSection, weather}) => {
    return <TodayWeather weather={weather}></TodayWeather>
}