## Introduction
In this school project, we develop a mobile weather app  
With this app, you can view the current weather stats, weather in the upcoming days and much more

Framework: React Native and Expo  
APIs: Open Weather App (huge help!), Google Air Quality and Google Pollen API

## How to set up?
- Create a .env file and put the API keys inside, here the example:
```
API_KEY=OPEN_WEATHER_API_KEY
GOOGLE_KEY=GOOGLE_API_KEY
```

After cloning this project, run these commands to install neccessary modules:

```
    npm install
    npx expo install
```

And lastly, to run the project, you use:

```
    npx expo start
```

## How to build the app?
- To use the widget and notification features of this app, you need to build the it
- Note that we only use local build option of Expo so other options may not work here 
- Here are some errors we encounter during the process and the way we fix it:
1. SDK location not found: add path variable to the SDK location
2. "RNSS Screen" was not found: search for all the necessary modules and download them
3. splashscreen_background not found: add color with the name 'splashscreen_background' to colors.xml

##
The app is developed during a very short amount of time so bugs are inevitable. If you encounter any bugs, feel free to contact us!