import { useContext, useState, useEffect  } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Overlay } from 'react-native-maps';
import Slider from "@react-native-community/slider";
import Checkbox from 'expo-checkbox'
import { LinearGradient } from "expo-linear-gradient";

import config from "../../config";
import { FunctionalContext, WeatherContext } from "../Context";
import { TouchableOpacity } from "react-native";

export default Radar = () => {
    const { location } = useContext(WeatherContext)
    const [region, setRegion] = useState({
        latitude: location?.lat ? location.lat : 0,
        longitude: location?.long ? location.long : 0,
        latitudeDelta: 0.5,
        longitudeDelta: 1
    });
    const [opacity, setOpacity] = useState(1)
    const { t, isDarkMode } = useContext(FunctionalContext)
    const [overlayImages, setOverlayImages] = useState([])
    const [menuPressed, setMenuPressed] = useState(false)
    const [mapIndex, setMapIndex] = useState(0)

    const mapList = [
        {name: t('radar.temp'), layer: 'temp_new'},
        {name: t('radar.precip'), layer: 'precipitation_new'},
        {name: t('radar.wind'), layer: 'wind_new'},
        {name: t('radar.cloud'), layer: 'clouds_new'},
        {name: t('radar.pressure'), layer: 'pressure_new'}
    ]

    const getMercatorCoordinates = ({lat, long}) => {
        return {
            x: (long + 180) / 360, 
            y: (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2
        }
    }

    const getTileCoordinates = (x, y, zoom) => {
        const numTiles = Math.pow(2, zoom)
        return {x: Math.floor(x * numTiles), y: Math.floor(y * numTiles)}
    }

    const getMapBoundaries = (region) => {
        const latitudeDelta = region.latitudeDelta;
        const longitudeDelta = region.longitudeDelta;
        const latitude = region.latitude;
        const longitude = region.longitude;

        const northEastLat = latitude + latitudeDelta / 2;
        const northEastLng = longitude + longitudeDelta / 2;

        const southWestLat = latitude - latitudeDelta / 2;
        const southWestLng = longitude - longitudeDelta / 2;

        const northWestLat = northEastLat;
        const northWestLng = southWestLng;

        const southEastLat = southWestLat;
        const southEastLng = northEastLng;

        return {
            ne: { lat: northEastLat, long: northEastLng },
            nw: { lat: northWestLat, long: northWestLng },
            se: { lat: southEastLat, long: southEastLng },
            sw: { lat: southWestLat, long: southWestLng }
        };
    };

    //calculate in mercator form
    const getSurroundingArea = ({ne, nw, se, sw}) => {
        const dist =  Math.sqrt((sw.x - ne.x) ** 2 + (sw.y - ne.y) ** 2) //distance between SW and NE
        ne = {x: (ne.x + dist > 1) ? 1 : ne.x + dist, y: (ne.y - dist < 0) ? 0 : ne.y - dist}
        nw = {x: (nw.x - dist < 0) ? 0 : nw.x - dist, y: (nw.y - dist < 0) ? 0 : nw.y - dist}
        se = {x: (se.x + dist > 1) ? 1 : se.x + dist, y: (se.y + dist > 1) ? 1 : se.y + dist}
        sw = {x: (sw.x - dist < 0) ? 0 : sw.x - dist, y: (sw.y + dist > 1) ? 1 : sw.y + dist}

        return {ne, nw, se, sw}
    }

    const getZoomLevel = (latitudeDelta) => (Math.ceil(Math.log(360 / latitudeDelta)) < 9) ? Math.ceil(Math.log(360 / latitudeDelta)) : 9

    const fetchOverlayImages = async (tiles, zoom) => {
        try {
            const images = await Promise.all(tiles.map(async ({ x, y }) => {
                const url = `https://tile.openweathermap.org/map/${mapList[mapIndex].layer}/${zoom}/${x}/${y}.png?appid=${config.API_KEY}`
                return { x, y, zoom, url };
            }));
            
            setOverlayImages(images);
        } catch (error) {
            console.error('Error fetching overlay images:', error);
        }
    }

    const reverseMercator = (x, y, zoom) => {
        const n = Math.PI - 2 * Math.PI * y / Math.pow(2, zoom);
        return { lat: 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))), long: x / Math.pow(2, zoom) * 360 - 180 }
    }

    const getBounds = (tileX, tileY, zoom) => {
        const ne = reverseMercator(tileX + 1, tileY, zoom);
        const sw = reverseMercator(tileX, tileY + 1, zoom);
        return [ [sw.lat, sw.long], [ne.lat, ne.long] ]
    }

    const getTiles = ({ne, sw}) => {
        let tiles = []

        for (let x = sw.x; x <= ne.x; x++) {
            for (let y = ne.y; y <= sw.y; y++) {
                tiles.push({ x, y });
            }
        }

        return tiles;
    }
    
    useEffect(() => {
        const zoom = getZoomLevel(region.latitudeDelta)
        const {ne, nw, se, sw} = getMapBoundaries(region)
        const neXY = getMercatorCoordinates(ne)
        const nwXY = getMercatorCoordinates(nw)
        const seXY = getMercatorCoordinates(se)
        const swXY = getMercatorCoordinates(sw)
        const {ne: surNE, sw: surSW} = getSurroundingArea({ne: neXY, nw: nwXY, se: seXY, sw: swXY})
        const {x: neTileX, y: neTileY} = getTileCoordinates(surNE.x, surNE.y, zoom)
        const {x: swTileX, y: swTileY} = getTileCoordinates(surSW.x, surSW.y, zoom)
        fetchOverlayImages(getTiles({ne: {x: neTileX, y: neTileY}, sw: {x: swTileX, y: swTileY}}), zoom)
    }, [region]);

    return (
        <View style={{flexGrow: 1}}>
            <Pressable style={{flexGrow: 1}} onPress={() => setMenuPressed(false)}>
                <View style={{position: 'absolute',  left: 0, top: 0, marginLeft: 0, height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 100}}>
                    <View style={{backgroundColor: '#1E1E1E', height: '80%', justifyContent: 'center', borderRadius: 5, padding: 5, alignItems: 'center'}}>
                        <Text style={{color: 'white', fontSize: 12, marginBottom: 2}}>{gradients[mapIndex].min}</Text>
                        <LinearGradient
                            colors={gradients[mapIndex].colors}
                            locations={gradients[mapIndex].locations}
                            style={{
                                height: '90%',
                                width: 20,     
                                borderRadius: 5,
                            }}
                        />
                        <Text style={{color: 'white', fontSize: 12, marginTop: 2}}>{gradients[mapIndex].max}</Text>
                    </View>
                </View>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    userInterfaceStyle={isDarkMode ? 'dark' : 'light'}
                    style={{width: '100%', flex: 1}}
                    rotateEnabled={false}
                    showsCompass={false}
                    mapType='standard'
                    initialRegion={region}
                    onRegionChangeComplete={setRegion}
                >
                    {overlayImages?.map((tile, index) => (
                        <Overlay
                            key={index}
                            bounds={getBounds(tile.x, tile.y, tile.zoom)}
                            image={{ uri: tile.url }}
                            opacity={opacity}
                        />
                    ))}
                </MapView>
            </Pressable>
            {
                menuPressed ?
                <View style={[styles.taskbar, isDarkMode && {backgroundColor: '#1E1E1E'}]}>
                    <View style={{marginTop: 15, marginHorizontal: 10, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <MaterialCommunityIcons name='menu-open' color={isDarkMode ? 'white' : 'black'} size={20}></MaterialCommunityIcons>
                            <Text style={{fontWeight: 'bold', marginLeft: 5, fontSize: 16, color: isDarkMode ? 'white' : 'black'}}>Menu</Text>
                        </View>    
                        <Pressable onPress={() => setMenuPressed(false)}>
                            <MaterialCommunityIcons name='close' size={20} color={isDarkMode ? 'white' : 'black'}></MaterialCommunityIcons>
                        </Pressable>
                    </View>
                    <View style={[{marginTop: 5, borderWidth: 0.5, borderBottomColor: '#EEEDEB'}, isDarkMode && { borderBottomColor: 'grey' }]}></View>
                    <View style={{marginTop: 10, marginHorizontal: 10, justifyContent: 'space-between',}}>
                        <Text style={{fontWeight: 'bold', color: isDarkMode ? 'white' : 'black'}}>{t('radar.opacity')}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            {
                                isDarkMode ? 
                                <MaterialCommunityIcons name='cloud' color='white' size={16}></MaterialCommunityIcons>
                                : <MaterialCommunityIcons name='weather-cloudy' size={20}></MaterialCommunityIcons>
                            }
                            <Slider
                                style={{width: '80%', height: 40}}
                                minimumValue={0}
                                maximumValue={1}
                                minimumTrackTintColor={!isDarkMode ? "#068FFF" : '#2D5DA1'}
                                thumbTintColor={!isDarkMode ? "#068FFF" : '#2D5DA1'}
                                onSlidingComplete={(val) => setOpacity(val)}
                                value={opacity}
                            />
                            {
                                isDarkMode ? 
                                <MaterialCommunityIcons name='weather-cloudy' color='white' size={20}></MaterialCommunityIcons>
                                : <MaterialCommunityIcons name='cloud' size={16}></MaterialCommunityIcons>
                            }       
                        </View>   
                    </View>
                    <View style={{marginTop: 10, marginHorizontal: 10, justifyContent: 'space-between',}}>
                        <Text style={{fontWeight: 'bold', marginBottom: 10, color: isDarkMode ? 'white' : 'black'}}>{t('radar.layer')}</Text>
                        {
                            mapList.map((map, index) => {
                                return <View key={index} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
                                    <Checkbox color={!isDarkMode ? "#068FFF" : '#2D5DA1'} value={index == mapIndex}
                                        onValueChange={() => {
                                            setMapIndex(index)
                                            const temp = overlayImages.map((image) => {
                                                const { x, y, zoom } = image
                                                const url = `https://tile.openweathermap.org/map/${mapList[index].layer}/${zoom}/${x}/${y}.png?appid=${config.API_KEY}`
                                                return {x, y, zoom, url}
                                            })
                                            
                                            setOverlayImages(temp)
                                        }}
                                    ></Checkbox>
                                    <Text style={{marginLeft: 5, color: isDarkMode ? 'white' : 'black'}}>{map.name}</Text>
                                </View>
                            })
                        }
                    </View>   
                </View> :
                <View style={{backgroundColor: isDarkMode ? '#1E1E1E' : 'white', borderRadius: 50, padding: 10, position: 'absolute', right: '5%', bottom: '3%'}}>
                    <TouchableOpacity onPress={() => setMenuPressed(true)}>
                        <MaterialCommunityIcons name="menu" color={isDarkMode ? 'white' : 'black'} size={24}></MaterialCommunityIcons>
                    </TouchableOpacity>
                </View> 
            }
        </View>
    )
}

const styles = StyleSheet.create({
  taskbar: { 
      position: 'absolute', 
      top: 0, 
      right: 0, 
      width: '57%', 
      height: "100%", 
      backgroundColor: 'white', 
  },
  taskbarLogo: {
    width: 40,
    height: 40
  },
  grid: {
    padding: 10,
    paddingLeft: 10,
    marginBottom: 5,
    borderBottomWidth: 0.20,
    borderBottomColor: 'grey'
  },
  header: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }, 
  footer: {
    backgroundColor: 'white', 
    borderTopWidth: 0.5,
    borderTopColor: 'grey'
  }
})

const gradients = [
    {
        colors: [
            'rgba(130, 22, 146, 1)',
            'rgba(130, 22, 146, 1)',
            'rgba(130, 22, 146, 1)',
            'rgba(130, 22, 146, 1)',
            'rgba(130, 87, 219, 1)',
            'rgba(32, 140, 236, 1)',
            'rgba(32, 196, 232, 1)',
            'rgba(35, 221, 221, 1)',
            'rgba(194, 255, 40, 1)',
            'rgba(255, 240, 40, 1)',
            'rgba(255, 194, 40, 1)',
            'rgba(252, 128, 20, 1)'
        ],
        locations:[0, 0.0909, 0.1818, 0.2727, 0.3636, 0.4545, 0.5454, 0.6363, 0.7272, 0.8181, 0.9090, 1],
        min: '-65°C',
        max: '30°C'
    },
    {
        colors: [
            'rgba(110, 110, 205, 0.3)',
            'rgba(125, 125, 210, 0.4)',   
            'rgba(145, 145, 215, 0.5)',  
            'rgba(105, 105, 220, 0.6)',   
            'rgba(80, 80, 225, 0.7)',
            'rgba(65, 65, 230, 0.75)',   
            'rgba(50, 50, 240, 0.8)',   
            'rgba(35, 35, 245, 0.85)',   
            'rgba(20, 20, 255, 0.9)'
        ],
        locations: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
        min: '0mm',
        max: '140'
    },
    {
        colors: [
            'rgba(238,206,206, 0.4)',
            'rgba(179,100,188, 0.7)',
            'rgba(179,100,188, 0.7)',
            'rgba(63,33,59, 0.8)',
            'rgba(116,76,172, 0.9)',
            'rgba(70,0,175,1)',
            'rgba(13,17,38,1)'
        ],
        locations: [0, 0.1667, 0.3333, 0.5, 0.6667, 0.8333, 1],
        min: '0m/s',
        max: 200
    },
    {
        colors: [
            'rgba(249, 248, 255, 0.4)',
            'rgba(247, 247, 255, 0.5)',
            'rgba(246, 245, 255, 0.75)',
            'rgba(244, 244, 255, 1)',
            'rgba(243, 242, 255, 1)',
            'rgba(242, 241, 255, 1)',
            'rgba(240, 240, 255, 1)'
        ],
        locations: [0, 0.1667, 0.3333, 0.5, 0.6667, 0.8333, 1],
        min: '0%',
        max: '100%'
    },
    {
        colors: [
            'rgba(0, 115, 255, 1)',
            'rgba(0, 170, 255, 1)',
            'rgba(75, 208, 214, 1)',
            'rgba(141, 231, 199, 1)',
            'rgba(176, 247, 32, 1)',
            'rgba(240, 184, 0, 1)',
            'rgba(251, 85, 21, 1)',
            'rgba(243, 54, 59, 1)',
            'rgba(198, 0, 0, 1)'
        ],
        locations: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
        min: '94k',
        max: '108k'
    }
];
