import { FlexWidget, ImageWidget, TextWidget } from 'react-native-android-widget';

export function BigWidget({weather, location, daily, date, nextDays, locationDetails, unit, lang, isDarkMode}) {
  const getText = (text) => {
    switch (text) {
      case 'error':
        if (lang == 'en') return 'Find a location in the app first'
        if (lang == 'vn') return 'Hãy tìm một vị trí bằng ứng dụng'
      case 'humidity':
        if (lang == 'en') return 'Humidity '
        if (lang == 'vn') return 'Độ ẩm '
      case 'feels':
        if (lang == 'en') return 'Feels like '
        if (lang == 'vn') return 'Cảm giác như '
    }
  }

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        borderRadius: 16,
      }}
    >
      {
        location && weather && daily && date && nextDays && locationDetails ?
        <FlexWidget style={{
          backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          height: 'match_parent',
          width: 'match_parent',
          borderRadius: 16,
          padding: 20
        }}>
            <FlexWidget style={{flexDirection: 'row', justifyContent: 'space-between', width: 'match_parent'}}>
              <TextWidget style={{color: isDarkMode ? '#FFFFFF' : '#000000'}} text={date}></TextWidget>
              <TextWidget style={{color: isDarkMode ? '#FFFFFF' : '#000000'}} text={locationDetails}></TextWidget>
            </FlexWidget>
            <FlexWidget style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, width: 'match_parent'}}>
                <FlexWidget style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextWidget style={{color: isDarkMode ? '#FFFFFF' : '#000000', fontSize: 30, paddingRight: 5}} text={Math.round(weather.temp) + unit}></TextWidget>
                    <ImageWidget 
                        image={`http://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
                        imageWidth={50}
                        imageHeight={50}
                    >    
                    </ImageWidget>
                </FlexWidget>
                <FlexWidget style={{alignItems: 'flex-end'}}>
                    <FlexWidget style={{alignItems: 'flex-end', flexDirection: 'row'}}>
                        <TextWidget style={{color: isDarkMode ? '#FFFFFF' : '#000000'}} text={getText('humidity')}></TextWidget>
                        <TextWidget style={{fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#000000'}} text={`${weather.humidity}`}></TextWidget>
                    </FlexWidget>
                    <FlexWidget style={{alignItems: 'flex-end', flexDirection: 'row'}}>
                        <TextWidget style={{color: isDarkMode ? '#FFFFFF' : '#000000'}} text={getText('feels')}></TextWidget>
                        <TextWidget style={{fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#000000'}} text={`${Math.round(weather.feels_like)}${unit}`}></TextWidget>
                    </FlexWidget>
                </FlexWidget>
            </FlexWidget>
            <FlexWidget style={{borderWidth: isDarkMode ? 0.2 : 1, borderColor: isDarkMode ? 'grey' : '#000000', borderRadius: 10, height: 80, marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 'match_parent'}}>
                {
                    nextDays?.map((date, index) => {
                        return <FlexWidget key={index} style={{paddingHorizontal: 8}}>
                            <FlexWidget style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TextWidget style={{color: isDarkMode ? '#FFFFFF' : '#000000', fontWeight: 'bold'}} text={`${Math.round((daily[index]?.temp?.min + daily[index]?.temp?.max) / 2)}${unit}`}></TextWidget>
                                <ImageWidget 
                                    image={`http://openweathermap.org/img/wn/${daily[index]?.weather[0].icon}@2x.png`}
                                    imageWidth={30}
                                    imageHeight={30}
                                ></ImageWidget>
                            </FlexWidget>
                            <TextWidget style={{color: isDarkMode ? '#808080' : '#000000'}} text={`${date}`}></TextWidget>
                        </FlexWidget>
                    })
                }
            </FlexWidget>
          </FlexWidget>
        : 
         <FlexWidget
          style={{
            height: 'match_parent',
            width: 'match_parent',
            backgroundColor: isDarkMode ? '#1E1E1E' : 'rgba(255, 255, 255, 0.6)',
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ImageWidget image={require('../../assets/warning_sign.png')} imageWidth={50} imageHeight={50} style={{marginRight: 10}}>
          </ImageWidget>
          <TextWidget  style={{color: isDarkMode ? '#FFFFFF' : '#000000', paddingHorizontal: 10, width: 120, fontWeight: 'bold'}} text={getText('error')}>
          </TextWidget>
        </FlexWidget>
      }
    </FlexWidget>
  );
}
