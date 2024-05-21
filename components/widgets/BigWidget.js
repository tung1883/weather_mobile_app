import { FlexWidget, ImageWidget, TextWidget } from 'react-native-android-widget';

export function BigWidget({weather, location, daily, date, nextDays, locationDetails}) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
      }}
    >
      {
        location && weather && daily && date && nextDays && locationDetails ?
        <FlexWidget style={{
          backgroundColor: '#1E1E1E',
          height: 'match_parent',
          width: 'match_parent',
          borderRadius: 16,
          padding: 20
        }}>
            <FlexWidget style={{flexDirection: 'row', justifyContent: 'space-between', width: 'match_parent'}}>
              <TextWidget style={{color: 'white'}} text={date}></TextWidget>
              <TextWidget style={{color: 'white'}} text={locationDetails}></TextWidget>
            </FlexWidget>
            <FlexWidget style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, width: 'match_parent'}}>
                <FlexWidget style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextWidget style={{color: 'white', fontSize: 30, paddingRight: 5}} text={weather.temp + '°C'}></TextWidget>
                    <ImageWidget 
                        image={`http://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
                        imageWidth={50}
                        imageHeight={50}
                    >    
                    </ImageWidget>
                </FlexWidget>
                <FlexWidget style={{alignItems: 'flex-end'}}>
                    <FlexWidget style={{alignItems: 'flex-end', flexDirection: 'row'}}>
                        <TextWidget style={{color: 'white'}} text={'Humidity '}></TextWidget>
                        <TextWidget style={{fontWeight: 'bold', color: 'white'}} text={`${weather.humidity}`}></TextWidget>
                    </FlexWidget>
                    <FlexWidget style={{alignItems: 'flex-end', flexDirection: 'row'}}>
                        <TextWidget style={{color: 'white'}} text={'Feels like '}></TextWidget>
                        <TextWidget style={{fontWeight: 'bold', color: 'white'}} text={`${Math.round(weather.feels_like)}°C`}></TextWidget>
                    </FlexWidget>
                </FlexWidget>
            </FlexWidget>
            <FlexWidget style={{borderWidth: 0.2, borderColor: 'grey', borderRadius: 10, height: 80, marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 'match_parent'}}>
                {
                    nextDays?.map((date, index) => {
                        return <FlexWidget key={index} style={{paddingHorizontal: 8}}>
                            <FlexWidget style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TextWidget style={{color: 'white', fontWeight: 'bold'}} text={`${Math.round((daily[index]?.temp?.min + daily[index]?.temp?.max) / 2)}°C`}></TextWidget>
                                <ImageWidget 
                                    image={`http://openweathermap.org/img/wn/${daily[index]?.weather[0].icon}@2x.png`}
                                    imageWidth={30}
                                    imageHeight={30}
                                ></ImageWidget>
                            </FlexWidget>
                            <TextWidget style={{color: 'grey'}} text={`${date}`}></TextWidget>
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
            backgroundColor: '#1E1E1E',
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ImageWidget image={require('../../assets/warning_sign.png')} imageWidth={50} imageHeight={50} style={{marginRight: 10}}>
          </ImageWidget>
          <TextWidget  style={{color: 'white', paddingHorizontal: 10, width: 120, fontWeight: 'bold'}} text='Find a location in the app first '>
          </TextWidget>
        </FlexWidget>
      }
    </FlexWidget>
  );
}
