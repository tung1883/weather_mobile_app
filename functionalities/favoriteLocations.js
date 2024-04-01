//3 types of location that is on the favs:
//1. current location (if permitted)
//2. most viewed locations (auto update after search, take only 5 cities)
//3. user-defined fav. (user explicitly set to fav. )

//each location is stored as: {city, country}

import AsyncStorage from "@react-native-async-storage/async-storage"

//add locations which are added to the favs explicitly by the user
export const addFavorite = async ({favs, setFavs, newFav}) => {
    let isInfavs = false
    favs.find((locationObj) => {
      if (locationObj?.location === newFav) {
        locationObj.favorite = true
        isInfavs = true
      }
    })

    if (!isInfavs) {
      favs.push({ newFav, counter: 0, favorite: true})
    } 

    sortLocations(favs)
    setFavs(favs)
    await AsyncStorage.setItem('favoriteLocations', JSON.stringify(favs))
}

//add 1 counter if user visit a location
export const addCounter = async ({favs, setFavs, location}) => {
  let isInfavs = false

  favs.find((obj) => {
      if (obj?.location?.city != location.city || obj?.location?.country != location.country) return
        
      obj.counter += 1
      isInfavs = true
  })

  if (!isInfavs) {
      favs.push({location, counter: 1, favorite: false})
  } 

  sortLocations(favs)
  setFavs(favs)
  await AsyncStorage.setItem('favoriteLocations', JSON.stringify(favs))
} 

export const removeLocation = async ({favs, setFavs, location}) => {
  favs = favs.filter(obj => obj.city !== location.city || obj.country !== location.country)
  sortLocations(favs)
  setFavs(favs)
  await AsyncStorage.setItem('favoriteLocations', JSON.stringify(favs))
}

export const getFavoriteLocations = async ({currentLoc, favs}) => {
  try {
    const favsCopy = [...favs]
    if (currentLoc) favsCopy.push({ location: currentLoc, current: true})
    sortLocations(favsCopy)
    return favsCopy.sort((a, b) => {
      if (a.current !== b.current) {
        return a.current ? -1 : 1;
      }
    })
  } catch (err) {
    console.log(err)
    return []
  }
}

const sortLocations = async (favs) => {
  favs.sort((a, b) => {
    if (a.favorite === b.favorite) {
      return b.counter - a.counter
    } else {
      return a.favorite ? -1 : 1;
    }
  });
}