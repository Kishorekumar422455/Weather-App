const express=require('express');
const axios=require('axios');
const ejs=require('ejs');
const app=express();


//Set the view Engine to Ejs
app.set("view engine","ejs");

//set the public folder as static folder
app.use(express.static("public"));


//Render the template with default data and error 
app.get("/",function(req,res){
    res.render("index",{weather:null,error:null});
});

//Handle the weather request
app.get("/weather",async function(req,res){
    const city=req.query.cityName;
    // const state=req.query.stateCode;
    // const country=req.query.countryCode;
    const apikey="e52661023d5472481063abc4543f183f";

    let weather = null;
    let error = null;

    try {
        // First get geocoding data (lat, lon) for the city
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`;
        const geoResp = await axios.get(geoUrl);
        if (!geoResp.data || geoResp.data.length === 0) {
            throw new Error('City not found');
        }

        const location = geoResp.data[0];
        const lat = location.lat;
        const lon = location.lon;

        // Now fetch the current weather using the coordinates
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apikey}`;
        const weatherResp = await axios.get(weatherUrl);
        weather = weatherResp.data;
    } catch (err) {
        weather = null;
        error = "City not found! Please try again.";
    }

    // Render the template with weather data and error
    res.render("index", { weather, error });
});

let port=3000;
//start ther server on port 3000
app.listen(port,function(){
    console.log("Server is on port 3000");
});