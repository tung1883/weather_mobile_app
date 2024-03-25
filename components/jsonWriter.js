import AsyncStorage from '@react-native-async-storage/async-storage'

export const jsonWriter = async (key, json) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(json));
    } catch (error) {
        console.error('Error write data:', error);
    }
};

export const loadAllData = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const items = await AsyncStorage.multiGet(keys);

        // Process the items array
        items.forEach(([key, value]) => {

        console.log(`${key}: ${value},`);
        });
    } catch (error) {
        console.error('Error loading data:', error);
    }
};