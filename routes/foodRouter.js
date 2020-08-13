const express = require('express')
const router = express.Router()
const axios = require('axios')
// Obtaining the API Key from process.env
const { YELP_API_KEY } = process.env 

//--sweetAlert??
//const { default: swal } = require('sweetalert');


//---Yelp Endpoints can be found at this link:
//---https://www.yelp.com/developers/documentation/v3/business_search


//Handles a "/food" case, redirects back home 
//Handles a "/food/location=" case, with an empty "city" key, returns back home
router.get('/', (req, res, next) => { res.redirect('/')})
router.get('/location=', (req, res) => { res.redirect('/')})

//After User input, redirects to search results with location info in the URL
router.post('/results', (req, res) => { 
    if(!req.body.cityBox){throw new Error("No Location Specified")} // -- Throws error if search box was left blank
    res.redirect(`/food/location=${req.body.cityBox}/page=1`)       // -- Redirects to LISTING API CALL below, at page 1  
});

//This lets the user type in a URL of "/food/location=NAME" and sends them to page one of their search results
router.get('/location=:city', (req, res) => { res.redirect(`/food/location=${req.params.city}/page=1`) })

/* ---- LISTING API CALL ----
    --- Makes an API call to yelp taking in the "city" URL param, and calcuates an offset value for page mechanic "listingOffSet"
    --- Sends back an object response.data, and within response.data.buisnesses is an object that has the current list of 10 listings
    --- Listings are 1-10, with each page offsetting the results by 10 (so page 2 has 11-20, so on and so forth.)
    ------TO DO------
    - Make a seperate API call to handle a price filter mechanic(price=1 is $, price=4 is $$$$)
    - Make a seperate API call to handle delivery vs takeout options(called "transaction", see Yelp Endpoints above)
    - Make a seperate API call to handle both above cases ^^
*/
router.get('/location=:city/page=:page', (req, res) => { 
    var listingOffSet = (req.params.page - 1) * 10
    var config = {
        method: 'get', 
        url: `https://api.yelp.com/v3/businesses/search?term=restaurants&location=${req.params.city}&limit=10&sort_by=distance&offset=${listingOffSet}`,
        headers: { 
            'Authorization': `Bearer ${YELP_API_KEY}`
        }
    };
    axios(config)
    .then((response) => {
        res.render('food/foodListings', {
            city: req.params.city,
            page: req.params.page,
            restaurants: response.data.businesses,
            data: response.data
        })
    })
    .catch(function (error) {
        console.log(error);
        res.redirect('/')
    });
})

//API call to get food place info by ID
router.get('/location=:city/page=:page/id=:id', async (req, res) => {
    console.log(req.params.id + " " + req.params.city)
    const { id } = req.params

    var config = {
        method: 'get',
        url: `https://api.yelp.com/v3/businesses/${req.params.id}`,
        headers: { 
            'Authorization': `Bearer ${YELP_API_KEY}`
        }
    };
    try {
        const { data: restaurant } = await axios(config)
        //console.log(restaurant) // This is the Restaurant info in Json format!!!
        res.render("food/foodShow", {
            restaurant,
            id: req.params.id,
            page: req.params.page,
            city: req.params.city,
            location: restaurant.location
        })


    }catch (err){
        console.log(err);
        res.redirect('/')
    }

 
})

module.exports = router;