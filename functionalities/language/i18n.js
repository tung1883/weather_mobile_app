import i18n from 'i18next'; 
import {initReactI18next} from 'react-i18next'; 
import language from './language.json'; 

i18n.use(initReactI18next).init({ 
    compatibilityJSON: 'v3',
    lng: 'vn', 
    fallbackLng: 'en', 
    resources: { 
        en: language.en,
        vn: language.vn
    }, 
    interpolation: { 
        escapeValue: false // react already safes from xss 
    } 
}); 

export default i18n; 
