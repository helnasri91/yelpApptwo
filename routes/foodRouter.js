const express = require('express')
const router = express.Router()
const axios = require('axios')

// Obtaining the API Key from process.env
const { YELP_API_KEY } = process.env 

// A temporary storage for all the chains we want to blacklist from access on our site
// -- https://www.restaurantbusinessonline.com/top-500-chains?year=2020&page=2#data-table
const chainCompanies = [ "Fatburger" , "WaBa Grill" , "Piara Pizza" , "Wienerschnitzel" , "Ono Hawaiian BBQ" , "Chuck E. Cheese" , "EveryTable" , "Yoshinoya" , "Pizzaroni", "" , 
"Winchell's Donuts" , " " , "McDonald's" , "Starbucks" , "Chick-fil-A" , "Taco Bell" , "Burger King" , "Subway" , "Wendy's" , "Dunkin" , "Domino's Pizza" , "Dominos Pizza", "Rally's" ,
"Panera Bread" , "Pizza Hut" , "Chipotle Mexican Grill" , "Sonic Drive-In" , "KFC" , "Olive Garden" , "Olive Garden Italian Restaurant", "Applebee's" , "Applebee's Grill + Bar", "Panda Express" , "Arby's" , "Popeyes Louisiana Kitchen" ,
"Little Caesars Pizza" , "Little Caesers Pizza", "Dairy Queen" , "Dairy Queen Orange Julius", "Buffalo Wild Wings" , "Chili's Grill & Bar" , "Chili's", "Jack in the Box" , "IHOP" , "Texas Roadhouse" , "Denny's" ,"Papa John's Pizza" , "Outback Steakhouse" ,
"Whataburger" , "Red Lobster" , "Cracker Barrel" , "The Cheesecake Factory" , "Jimmy John's" , "Hardee's" , "Zaxby's" , "LongHorn Steakhouse" , "Culver's" , "Golden Corral" , "Five Guys", 
"Five Guys Burgers and Fries" , "Red Robin Gourmet Burgers and Brews" , "Raising Cane's Chicken Fingers" , "Carl's Jr" , "Carl's Jr.", "Wingstop" , "Waffle House" , "Jersey Mike's Subs" , "Bojangles'" , "Bojangles Famous Chicken & Biscuits",
"BJ's Restaurant & Brewhouse" , "TGI Fridays" , "In-N-Out Burger" ,"Steak 'n Shake" , "P.F. Chang's" , "Qdoba Mexican Eats", "QDOBA Mexican Eats", "El Pollo Loco" , "Krispy Kreme" , "Hooters",  "Del Taco",  "Firehouse Subs",
"Bob Evans",  "Moe's Southwest Grill",  "Papa Murphy's Pizza" ,"Ruby Tuesday",  "McAlister's Deli" , "Cheddar's Scratch Kitchen", "Church's Chicken", "Tim Hortons", "Ruth's Chris Steak House", 
"Carrabba's Italian Grill", "Jason's Deli", "Marco's Pizza", "Shake Shack", "California Pizza Kitchen", "Baskin-Robbins", "Yard House", "Bonefish Grill", "White Castle", "Tropical Smoothie Cafe", 
"Dave & Buster's", "Dutch Bros. Coffee", "Captain D's Seafood Kitchen", "Auntie Anne's", "First Watch", "Perkins Restaurant & Bakery", "Freddy's Frozen Custard & Steakburgers", 
"Checkers Drive-In Restaurants", "Noodles & Company" , "Einstein Bros. Bagels" , "Einstein Bros Bagels", "Jamba" , "Portillo's" , "Boston Market" , "The Habit Burger Grill" , "Logan's Roadhouse" , "MOD Pizza" , "Smoothie King" ,
"Mellow Mushroom" , "The Capital Grille" , "Round Table Pizza" , "Miller's Ale House" , "Potbelly sandwich Shop" , "Hungry Howie's Pizza", "Lee's Sandwiches", "Jollibee", "Flame Broiler", "The Flame Broiler", "Blaze Fast-Fire'd Pizza", "L&L Hawaiian Barbecue", "Dickey's Barbecue Pit", "Louisiana Famous Fried Chicken" , "Sarku Japan" , "Sbarro", "Cinnabon", "Steak Escape", "A&W", "Wahoo's Fish Tacos", "QuikTrip", "Mazzio's Pizza", "sweetgreen", "Sweetgreen", "Luna Grill", "Uncle Tetsu", "Burgerim", "BurgerIM", "Philz Coffee"]

/* -- Throwing all Failures Here
    --Partial Faliure Cases
    -Yoshinoya Compton & Alameda 
    -Pizzaroni - Lynwood
    -Steak Escape Los Cerritos Mall
    -Chick-fil-A - Belmar
    -Luna Grill - Torrance


    
    --Total Failures
   -

   --Other
   -Rally's
   -Carl's Jr vs Carl's Jr.
   -Einstein Bros Bagels vs Einstein Bros. Bagels
   -Olive Garden Italian Restaurant vs Olive Garden
   -Chili's vs Chili's Grill & Bar
   -Qdboba vs QDOBA (caps)
   -The Flame Broiler vs Flame Broiler (first 10 wouldn't work in this case)
   -Little Caesers Pizza vs Little Caesars Pizza (spelling errors; first 10 may not work in these instances either)
   -Bojangles' vs Bojangles Famous Chicken & Biscuits
   -Applebee's vs Applebee's Grill + Bar
   -Five Guys Burgers and Fries vs Five Guys
*/

//---Yelp Endpoints can be found at this link:
//---https://www.yelp.com/developers/documentation/v3/business_search





router.get('/', (req, res, next) => { res.redirect('/')})
router.get('/location=', (req, res) => { res.redirect('/')}) 
router.post('/results', (req, res) => { 
    if(!req.body.cityBox){throw new Error("No Location Specified")} // -- Throws error if search box was left blank
    res.redirect(`/food/location=${req.body.cityBox}`)              // -- Redirects below, to add a page term.  
});

//This lets the user type in a URL of "/food/location=NAME" and sends them to their search results with price=all
router.get('/location=:city', (req, res) => { res.redirect(`/food/location=${req.params.city}/price=all`) })

/* ---- LISTING API CALL ----
    --- Makes an API call to yelp taking in the "city" URL param, and calcuates an offset value for page mechanic "listingOffSet"
    --- Sends back an object response.data, and within response.data.buisnesses is an object that has the current list of 10 listings
    --- Listings are 1-10, with each page offsetting the results by 10 (so page 2 has 11-20, so on and so forth.)
    ------TO DO------
    - Make a seperate API call to handle a price filter mechanic(price=1 is $, price=4 is $$$$)
    - Make a seperate API call to handle delivery vs takeout options(called "transaction", see Yelp Endpoints above)
    - Make a seperate API call to handle both above cases ^^
*/

router.get('/location=:city/price=:price', async (req, res) => { 
    const { city,page,price } = req.params //Grabs these items from the URL
    
    var priceFilter = 0; 
    
    if(price === "low"){
        priceFilter = 1;
    }else if(price === "med"){
        priceFilter = 2;
    }else if(price === "high"){ // ---------- // This Chain of if statements gets the price filter from the user choice in the url
        priceFilter = 3;
    }else if(price === "ultraHigh"){
        priceFilter = 4;
    } // -- Add a case for price="any" so user cant enter any string

    //If price=any, will search with no price filter consideration, Else, will search with price filter consideration
    const priceConsideration =  !priceFilter ? `` : `&price=${priceFilter}`
    console.log("Running API Call for List....")
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

            // Concatenate both arrays and store the result (firstRestaurants and second api response are put together into total results)
            var totalResults = firstRestaurants.concat(businesses)
            var adjustedResults = totalResults.filter( element => {  // -- Filters to whether or not the code is in the chainCompanies Array
                return !chainCompanies.includes(element.name)
                console.log(element.name) 
                console.log(!chainCompanies.includes(element.name))
            })
            console.log(adjustedResults.length)

            res.render('food/foodListings', {
                city,
                page,
                price,
                restaurants: adjustedResults,
                suggested: req.session.suggested 
        
            })
        })
    })
    .catch(function (error) {
        console.log(error);
        res.redirect('/')
    })



})

//API call to get food place info by ID
router.get('/location=:city/price=:price/id=:id', async (req, res) => {
    console.log(req.params.id + " " + req.params.city)
    const { id } = req.params
    var config = {
        method: 'get',
        url: `https://api.yelp.com/v3/businesses/${req.params.id}`,
        headers: { 
            'Authorization': `Bearer ${YELP_API_KEY}`
        }
    };
    var configTwo = {
        method:'get',
        url: `https://api.yelp.com/v3/businesses/${req.params.id}/reviews`,
        headers: {
            'Authorization': `Bearer ${YELP_API_KEY}`
        }
    };
    try {
        
        axios(config)
        .then((restaurant) => {
            //restaurant
            axios(configTwo)
            .then((reviews) => {
                res.render("food/foodShow", {
                    restaurant: restaurant.data,
                    // price: req.params.price,
                    // id: req.params.id,
                    // city: req.params.city,
                    reviews: reviews.data.reviews
                })
            })
        })
              
    }catch (err){
        console.log(err);
        res.redirect('/')
        }
})

  

//Route will be at /location=:city/price=:price/id=:id/save and will save the user's suggestion, then re-route them to the page with the paramater saved=true
router.get('/location=:city/price=:price/id=:id/save', (req,res) => {
    const { city,price,id } = req.params

    var config = {
        method: 'get',
        url: `https://api.yelp.com/v3/businesses/${req.params.id}`,
        headers: { 
            'Authorization': `Bearer ${YELP_API_KEY}`
        }
    };
    axios(config)
    .then((restaurant) => {

        const SendingObject = {
            restaurant: restaurant.data,
            id: req.params.id
        }

        var origLength = req.session.suggested.length // Stores Original Length
        req.session.suggested = req.session.suggested.filter( elem => { //Filters out a duplicate if it exists
            return elem.restaurant.name !== SendingObject.restaurant.name
        })
        if(origLength === req.session.suggested.length){// If no change occured, then push it in.
            req.session.suggested.push(SendingObject)
        }
        
        console.log(req.session.suggested)
        res.redirect(`/food/location=${city}/price=${price}`)

    })
    .catch((err) => {
        console.log(err);
        res.redirect('/')
    })




    // if(!req.session.suggested.includes(id)){
    //     req.session.suggested.push(id)
    // }else{
    //     //remove the suggestion
    //     req.session.suggested = req.session.suggested.filter( elem => {
    //         return elem !== id
    //     })
    // }
    
})

//Helper to check if Suggestion already Exists


module.exports = router;