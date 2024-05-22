import { useContext } from 'react';
import { View, Dimensions,  Text, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { lightStyles, darkStyles } from '../defaultStyles';
import { FunctionalContext } from '../Context';

const screenWidth = Dimensions.get('window').width;

const WidgetSettings = ({ navigation }) => {    
    const goBack = navigation?.canGoBack()
    const { isDarkMode, t, translateText} = useContext(FunctionalContext);

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 10, borderBottomColor: 'grey', borderBottomWidth: 0.5}}>
                {
                    goBack &&
                    <MaterialCommunityIcons 
                        name="arrow-left" size={24} color={isDarkMode ? "white" : "black"}
                        style={{margin: -3, padding: -3, marginRight: 15, paddingLeft: 20}}
                        onPress={() => {navigation.goBack()}}
                    />
                }
                <Text style={{color: isDarkMode ? 'white' : 'black', fontSize: 18, fontWeight: 'bold'}}>{t('widgetSettings.title')}</Text>
            </View>
            <View>
            <View>
                <View style={{marginTop: 20, marginBottom: 10, marginHorizontal: 10, padding: 20, borderRadius: 10, backgroundColor: isDarkMode ? '#31363F' : '#B4B4B8', alignItems: 'center'}}>
                    <Image
                        source={require('../../assets/widget-preview/small.png')}
                        style={{
                            width: (screenWidth - 60) / 1.5,
                            height: (screenWidth - 60) / 1.5 * 377 / 751
                        }}
                    >
                    </Image>
                </View>
                <Text style={{color: isDarkMode ? 'white' : 'black', textAlign: 'center'}}>{t('widgetSettings.small')}</Text>
                <View style={{marginTop: 30, marginBottom: 10, marginHorizontal: 10, padding: 20, borderRadius: 10, backgroundColor: isDarkMode ? '#31363F' : '#B4B4B8', alignItems: 'center'}}>
                    <Image
                        source={require('../../assets/widget-preview/big.png')}
                        style={{
                            width: (screenWidth - 60),
                            height: (screenWidth - 60) * 641 / 809
                        }}
                    >
                    </Image>
                </View>
                <Text style={{color: isDarkMode ? 'white' : 'black', textAlign: 'center'}}>{t('widgetSettings.big')}</Text>
                <Text style={{color: isDarkMode ? 'white' : 'black', textAlign: 'center', marginHorizontal: 10, fontWeight: 'bold', marginTop: 30}}>{t('widgetSettings.note1')}</Text>
                <Text style={{color: isDarkMode ? 'white' : 'black', textAlign: 'center', marginHorizontal: 10, fontWeight: 'bold'}}>{t('widgetSettings.note2')}</Text>
            </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: lightStyles.bgColor,
    },
    darkContainer: {
        backgroundColor: darkStyles.bgColor
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        backgroundColor: lightStyles.secondaryBgColor,
    },
    darkSearchBar: {
        borderColor: 'black',
        backgroundColor: darkStyles.secondaryBgColor,
    },
    input: {
        flex: 1,
        height: 40,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        fontSize: 16,
        color: lightStyles.contentColor
    },
    darkInput: {
        color: darkStyles.contentColor
    },
    list: {
        width: '100%',
    },
    item: {
        padding: 15,
        paddingLeft: 0,
        marginLeft: 5,
        fontSize: 14,
        color: 'black',
    },
    darkItem: {
        color: 'white'
    },
    itemContainer: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#444444',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    darkItemContainer: {
        borderBottomColor: '#ccc',
    },
    lastItemContainer: {
        borderBottomWidth: 0
    },
    button: {
        backgroundColor: '#085db4',
        paddingVertical: 15,
        paddingHorizontal: 20,
        paddingLeft: 10,
        borderRadius: 10, // Set corner radius to 10
        minWidth: 200,
        marginBottom: 10, 
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    darkButton: {
        backgroundColor: '#6495ED', 
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
    },
});

export default WidgetSettings;
