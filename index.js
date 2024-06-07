import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { registerWidgetTaskHandler } from 'react-native-android-widget';

import App from './App';
import { widgetTaskHandler } from './components/widgets/widgetTaskHandler';

registerRootComponent(App);
registerWidgetTaskHandler(widgetTaskHandler)
