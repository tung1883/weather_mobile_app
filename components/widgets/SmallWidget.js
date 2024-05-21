import { FlexWidget, ImageWidget, TextWidget } from 'react-native-android-widget';

export function SmallWidget({weather, location, icon, date}) {

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
        location && weather && icaon && date ?
        <FlexWidget
          style={{
            height: 'match_parent',
            width: 'match_parent',
            backgroundColor: '#1E1E1E',
            borderRadius: 16,
            flexDirection: 'row'
          }}
        >
          <FlexWidget
            style={{padding: 10, paddingRight: 40}}
          >
            <TextWidget text={weather}
              style={{fontSize: 24, color: 'white'}}
            ></TextWidget>
            <TextWidget text={location}
              style={{color: 'white', fontWeight: 'bold', marginVertical: 5}}
            ></TextWidget>
            <TextWidget text={date}
              style={{color: 'white'}}
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
            backgroundColor: '#1E1E1E',
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <ImageWidget image={require('../../assets/warning_sign.png')} imageWidth={50} imageHeight={50} style={{marginLeft: 20, marginRight: 10}}></ImageWidget>
          <TextWidget  style={{color: 'white', paddingHorizontal: 10, width: 120}} text='Find a location in the app first '>
          </TextWidget>
        </FlexWidget>
      }
    </FlexWidget>
  );
}
