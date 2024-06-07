import { useContext, useState, useEffect  } from "react";
import { View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Overlay } from 'react-native-maps';
import config from "../../config";

import { FunctionalContext } from "../Context";

export default Radar = () => {
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 30,
        longitudeDelta: 30
    });
    const { t, isDarkMode } = useContext(FunctionalContext)
    const [overlayImages, setOverlayImages] = useState([]);

    const fetchOverlayImage = async (x, y, zoom) => {
        try {
            const response = await fetch(
                `https://tile.openweathermap.org/map/clouds_new/${3}/${3}/${3}.png?appid=${config.API_KEY}`
            );
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
                setOverlayImage(reader.result);
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Error fetching overlay image:', error);
        }
    };

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
                const url = `https://tile.openweathermap.org/map/pressure_new/${zoom}/${x}/${y}.png?appid=${config.API_KEY}`
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
            <MapView
                provider={PROVIDER_GOOGLE}
                userInterfaceStyle={isDarkMode ? 'dark' : 'light'}
                style={{width: '100%', flex: 1}}
                rotateEnabled={false}
                showsCompass={false}
                mapType='satellite'
                initialRegion={region}
                onRegionChangeComplete={setRegion}
            >
                {overlayImages.map((tile, index) => (
                    <Overlay
                        key={index}
                        bounds={getBounds(tile.x, tile.y, tile.zoom)}
                        image={{ uri: tile.url }}
                        opacity={1}
                    />
                ))}
            </MapView>
        </View>
    )
}
