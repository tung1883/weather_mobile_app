import { FlexWidget, ImageWidget, TextWidget } from 'react-native-android-widget';

export function SmallWidget({weather, location, icon, lang, date, isDarkMode}) {
  const getText = (text) => {
    switch (text) {
      case 'error':
        if (lang == 'en') return 'Find a location in the app first'
        if (lang == 'vn') return 'Hãy tìm một vị trí bằng ứng dụng'
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
        location && weather && icon && date ?
        <FlexWidget
          style={{
            height: 'match_parent',
            width: 'match_parent',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
            borderRadius: 16,
            flexDirection: 'row'
          }}
        >
          <FlexWidget
            style={{padding: 10, paddingRight: 40}}
          >
            <TextWidget text={weather}
              style={{fontSize: 24, color: isDarkMode ? '#FFFFFF' : '#000000'}}
            ></TextWidget>
            <TextWidget text={location}
              style={{color: isDarkMode ? '#FFFFFF' : '#000000', fontWeight: 'bold', marginVertical: 5}}
            ></TextWidget>
            <TextWidget text={date}
              style={{color: isDarkMode ? '#FFFFFF' : '#000000'}}
            ></TextWidget>
          </FlexWidget>
          <ImageWidget
            image={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            imageWidth={88}
            imageHeight={88}
          >  
          </ImageWidget>
        </FlexWidget>
        : 
         <FlexWidget
          style={{
            height: 'match_parent',
            width: 'match_parent',
            backgroundColor: isDarkMode ? '#1E1E1E' : 'rgba(255, 255, 255, 0.6)',
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <ImageWidget image={require('../../assets/warning_sign.png')} imageWidth={50} imageHeight={50} style={{marginLeft: 20, marginRight: 10}}></ImageWidget>
          <TextWidget  style={{color: isDarkMode ? '#FFFFFF' : '#000000', paddingHorizontal: 10, width: 120}} text={getText('error')}>
          </TextWidget>
        </FlexWidget>
      }
    </FlexWidget>
  );
}
