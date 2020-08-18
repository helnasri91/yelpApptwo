const express = require('express')
const router = express.Router()
const axios = require('axios')
// Obtaining the API Key from process.env
const { YELP_API_KEY } = process.env 

// A temporary storage for all the chains we want to blacklist from access on our site
// -- https://www.restaurantbusinessonline.com/top-500-chains?year=2020&page=2#data-table
const chainCompanies = [ "Fatburger" , "WaBa Grill" , "Piara Pizza" , "Wienerschnitzel" , "Ono Hawaiian BBQ" , "Chuck E. Cheese" , "EveryTable" , "Yoshinoya" , "Pizzaroni", "" , 
"Winchell's Donuts" , " " , "McDonald's" , "Starbucks" , "Chick-fil-A" , "Taco Bell" , "Burger King" , "Subway" , "Wendy's" , "Dunkin" , "Domino's Pizza" , "Rally's" ,
"Panera Bread" , "Pizza Hut" , "Chipotle Mexican Grill" , "Sonic Drive-In" , "KFC" , "Olive Garden" , "Applebee's" , "Panda Express" , "Arby's" , "Popeyes Louisiana Kitchen" ,
"Little Caesars Pizza" , "Dairy Queen" , "Buffalo Wild Wings" , "Chili's Grill & Bar" , "Jack in the Box" , "IHOP" , "Texas Roadhouse" , "Denny's" ,"Papa John's Pizza" , "Outback Steakhouse" ,
"Whataburger" , "Red Lobster" , "Cracker Barrel" , "The Cheesecake Factory" , "Jimmy John's" , "Hardee's" , "Zaxby's" , "LongHorn Steakhouse" , "Culver's" , "Golden Corral" ,
"Five Guys Burgers and Fries" , "Red Robin Gourmet Burgers and Brews" , "Raising Cane's Chicken Fingers" , "Carl's Jr" , "Wingstop" , "Waffle House" , "Jersey Mike's Subs" , "Bojangles'" , 
"BJ's Restaurant & Brewhouse" , "TGI Fridays" , "In-N-Out Burger" ,"Steak 'n Shake" , "P.F. Chang's" , "Qdoba Mexican Eats", "El Pollo Loco" , "Krispy Kreme" , "Hooters",  "Del Taco",  "Firehouse Subs",
"Bob Evans",  "Moe's Southwest Grill",  "Papa Murphy's Pizza" ,"Ruby Tuesday",  "McAlister's Deli" , "Cheddar's Scratch Kitchen", "Church's Chicken", "Tim Hortons", "Ruth's Chris Steak House", 
"Carrabba's Italian Grill", "Jason's Deli", "Marco's Pizza", "Shake Shack", "California Pizza Kitchen", "Baskin-Robbins", "Yard House", "Bonefish Grill", "White Castle", "Tropical Smoothie Cafe", 
"Dave & Buster's", "Dutch Bros. Coffee", "Captain D's Seafood Kitchen", "Auntie Anne's", "First Watch", "Perkins Restaurant & Bakery", "Freddy's Frozen Custard & Steakburgers", 
"Checkers Drive-In Restaurants", "Noodles & Company" , "Einstein Bros. Bagels" , "Jamba" , "Portillo's" , "Boston Market" , "The Habit Burger Grill" , "Logan's Roadhouse" , "MOD Pizza" , "Smoothie King" ,
"Mellow Mushroom" , "The Capital Grille" , "Round Table Pizza" , "Miller's Ale House" , "Potbelly sandwich Shop" , "Hungry Howie's Pizza" ]

/* -- Throwing all Failures Here
    --Partial Faliure Cases
    -Yoshinoya Compton & Alameda 
    -Pizzaroni - Lynwood
    
    --Total Failures
   -
   -


   --Other
   -Rally's
   -
*/


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
    res.redirect(`/food/location=${req.body.cityBox}`)              // -- Redirects below, to add a page term.  
});
//This lets the user type in a URL of "/food/location=NAME" and sends them to page one of their search results
//Also defaults their search to no price filter, with price=all
router.get('/location=:city', (req, res) => { res.redirect(`/food/location=${req.params.city}/page=1/price=all`) })
router.get('/location=:city/page=:page', (req, res) => { res.redirect(`/food/location=${req.params.city}/page=${req.params.page}/price=all`) })
/* ---- LISTING API CALL ----
    --- Makes an API call to yelp taking in the "city" URL param, and calcuates an offset value for page mechanic "listingOffSet"
    --- Sends back an object response.data, and within response.data.buisnesses is an object that has the current list of 10 listings
    --- Listings are 1-10, with each page offsetting the results by 10 (so page 2 has 11-20, so on and so forth.)
    ------TO DO------
    - Make a seperate API call to handle a price filter mechanic(price=1 is $, price=4 is $$$$)
    - Make a seperate API call to handle delivery vs takeout options(called "transaction", see Yelp Endpoints above)
    - Make a seperate API call to handle both above cases ^^
*/

router.get('/location=:city/page=:page/price=:price', async (req, res) => { 
    const { city,page,price } = req.params //Grabs these items from the URL
    
    var priceFilter = 0; 
    
    if(price === "low"){
        priceFilter = 1;
    }else if(price === "med"){
        priceFilter = 2;
    }else if(price === "high"){ // ---------- // This Chain of if statements gets the price filter from the user choice in the url
        priceFilter = 3;
    }else if(price === "fancy"){
        priceFilter = 4;
    } // -- Add a case for price="any" so user cant enter any string

    //If price=any, will search with no price filter consideration, Else, will search with price filter consideration
    const priceConsideration =  !priceFilter ? `` : `&price=${priceFilter}`

    var config = { // -- Config for first 50 results
        method: 'get', 
        url: `https://api.yelp.com/v3/businesses/search?term=restaurants&location=${city}&limit=50&sort_by=distance${priceConsideration}`,
        headers: { 
            'Authorization': `Bearer ${YELP_API_KEY}`
        }
    };
    var configTwo = { // -- Config for the next 50 Results
        method: 'get', 
        url: `https://api.yelp.com/v3/businesses/search?term=restaurants&location=${city}&limit=50&sort_by=distance&offset=50${priceConsideration}`,
        headers: { 
            'Authorization': `Bearer ${YELP_API_KEY}`
        }
    };      
   
    axios(config) // -- First API Call, gathers 50 results
    .then((response) => {
        const { data:{ businesses } } = response // -- data = response.data, buisnesses = response.data.buisnesses
       

        //Consider string.split for cases with long names
        //Lowerasing in the array to prevent naming errors
  
        return businesses //-- Results from first API Call

    }).then((firstRestaurants) => { // firstRestaurants = buisnesses from previous .then() method

        axios(configTwo) // -- Second API call
        .then((response) => {
            const { data: { businesses }} = response

            // Concatenate both arrays and store the result
            var totalResults = firstRestaurants.concat(businesses)
            var adjustedResults = totalResults.filter( element => { 
                return !chainCompanies.includes(element.name)
                console.log(element.name) 
                console.log(!chainCompanies.includes(element.name))
            })
            console.log(adjustedResults.length)

            res.render('food/foodListings', {
                city,
                page,
                price,
                restaurants: adjustedResults 
        
            })
        })
    })
    .catch(function (error) {
        console.log(error);
        res.redirect('/')
    })

})


//API call to get food place info by ID
router.get('/location=:city/page=:page/price=:price/id=:id', async (req, res) => {
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
            price: req.params.price,
            id: req.params.id,
            page: req.params.page,
            city: req.params.city,
        })
    }catch (err){
        console.log(err);
        res.redirect('/')
    }
})

module.exports = router;