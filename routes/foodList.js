//API - YELP_API_KEY - stored in .env file -- access via process.env.YELP_API_KEY
//
// - Need to install the Yelp-fusion api helper. run this in terminal -
// - npm install yelp-fusion
const express = require('express')
const router = express.Router()
const axios = require('axios')

//Needed for the Yelp Fusion API package
const yelp = require('yelp-fusion')
const { YELP_API_KEY } = process.env // Obtaining the API Key from process.env
const client = yelp.client(`${YELP_API_KEY}`) // Obtaining Client info so we can make requests

/*
//API Call to get a list of food places by location
//For a full list of search options, look here
// - https://www.yelp.com/developers/documentation/v3/business_search
//Fusion Endpoints can be found here
// - https://github.com/tonybadguy/yelp-fusion
client.search({
    //In here, We choose Params as keys and insert strings to search by.
    //Will find a way to streamline this later so it only searches by filters
    //that the user chooses:
    
    //term: 'Four Barrel Coffee',
    location: ,
}).then(response => {
      //This is where we will print out the location listings, but for now it will print out the first
      //option on the json that is returned
    console.log(response.jsonBody);//.businesses[0]);
}).catch(e => {
    //Print Out an error if one arises
    console.log(e);
});
*/

router.get('/', (req, res, next) => {
  res.render('foodListings', { title: 'Food Listings Go Here!!!!' });
});


router.post('/getCity', (req, res) => {
    console.log(req.body)
    client.search({
        //In here, We choose Params as keys and insert strings to search by.
        //Will find a way to streamline this later so it only searches by filters
        //that the user chooses:
        
        //term: 'Four Barrel Coffee',
        location: req.body.cityBox,
        limit: 3
    }).then(response => {
        console.log(response.jsonBody.businesses)
        res.render('food/foodListings', {
            city: req.body.cityBox,
            restaurants: response.jsonBody.businesses
        })
    }).catch(e => {
        //Print Out an error if one arises, then redirect to home
        console.log(e);
        res.redirect('/')
    });
    
        
});

//API call to get food place info by ID



module.exports = router;