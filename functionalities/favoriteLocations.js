//3 types of location that is on the favs:
//1. current location (if permitted)
//2. most viewed locations (auto update after search, take only 5 cities)
//3. user-defined fav. (user explicitly set to fav. )

//each location is stored as: {city, country}

import AsyncStorage from "@react-native-async-storage/async-storage"

//add locations which are added to the favs explicitly by the user
export const addFavorite = async ({favs, setFavs, newFav}) => {
  let isInfavs = false
  favs.find((fav) => {
    if (JSON.stringify(fav?.location) == JSON.stringify(newFav.location)) {
      fav.favorite = true
      isInfavs = true
    }
  })

  if (!isInfavs) {
    favs.push({ ...newFav, counter: 0, favorite: true})
  } 

  sortLocations(favs)
  setFavs([...favs])
  await AsyncStorage.setItem('favoriteLocations', JSON.stringify(favs.filter((fav) => fav.gps !== true)))
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
  await AsyncStorage.setItem('favoriteLocations', JSON.stringify(favs.filter((fav) => fav.gps !== true)))
} 

export const removeLocation = async ({favs, setFavs, location}) => {
  favs = favs.filter(fav => JSON.stringify(fav.location) !== JSON.stringify(location))
  sortLocations(favs)
  setFavs(favs)
  await AsyncStorage.setItem('favoriteLocations', JSON.stringify(favs.filter((fav) => fav.gps !== true)))
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

export const putToFrontFavs = ({favs, setFavs, fav}) => {
  for (let i = 0; i < favs.length; i++) { 
    if (favs[i].location.city == fav.location.city) {
      favs.splice(i, 1)
      break
    } 
  }

  favs = [fav, ...favs] 

  setFavs([...favs.splice(0, 5)]);
}

export const sortLocations = async (favs) => {
  return favs.sort((a, b) => {
    // Rule 1: Sort by current (true > false)
    if (a.current !== b.current) {
        return a.current ? -1 : 1;
    }

    // Rule 2: Sort by gps (true > false)
    if (a.gps !== b.gps) {
        return a.gps ? -1 : 1;
    }

    // Rule 3: Sort by favorite (true > false)
    if (a.favorite !== b.favorite) {
        return a.favorite ? -1 : 1;
    }

    // Rule 4: Sort by counter in ascending order
    return a.counter - b.counter;
  });
}