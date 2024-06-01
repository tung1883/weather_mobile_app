import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { registerWidgetTaskHandler } from 'react-native-android-widget';

import App from './App';
import { widgetTaskHandler } from './components/widgets/widgetTaskHandler';
// import { PushNotification } from './components/PushNotification';

registerRootComponent(App);
registerWidgetTaskHandler(widgetTaskHandler)
