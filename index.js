const express = require('express');
const axios = require('axios');

const _ = require('dotenv').config();
const app = express();

const port = process.env.port || 9000;

const LOCATION_API_KEY = process.env.LOCATION_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const LOCATION_API_URL = process.env.LOCATION_API_URL;
const WEATHER_API_URL = process.env.WEATHER_API_URL;

console.log(LOCATION_API_KEY);
console.log(WEATHER_API_KEY);



app.get('/', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Dear';
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
   
    

try {
      // Get location based on IP
    const geoResponse = await axios.get(`${LOCATION_API_URL}?apiKey=${LOCATION_API_KEY}&fields=geo`);

    const geoData = geoResponse.data;
    const { latitude, longitude, city } = geoData;

 //To validate longitude and latitude
    if (!latitude || !longitude) {
        return res.status(400).json({
            error: "Invalid latitude or longitude received from geolocation API"
         });
    }

    // Get weather information
    const weatherResponse = await axios.get(`${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`);


    const temperature = weatherResponse.data.main.temp;

    return res.status(200).json({
        client_ip: clientIp,
        location: city || 'Unknown',
        greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city || 'Unknown'}`
    });


    } catch (error) {
        console.log('Error fetching data:', error.message || error);
       return res.status(500).json({
         error: 'Failed to fetch location or weather data' 
        });
    }
  
    });



app.listen(port, () => {
    console.log(`The server is running on http://localhost: ${port}...`)
});