//API - YELP_API_KEY - stored in .env file -- access via process.env.YELP_API_KEY
//
// - Need to install the Yelp-fusion api helper. run this in terminal -
// - npm install yelp-fusion
const express = require('express')
const router = express.Router()
const axios = require('axios')

//Needed for the Yelp Fusion API package
const { YELP_API_KEY } = process.env // Obtaining the API Key from process.env


/*
--API Call to get a list of food places by location
--For a full list of search options, look here
--- https://www.yelp.com/developers/documentation/v3/business_search
*/

router.get('/', (req, res, next) => {
  res.render('foodListings', { title: 'Food Listings Go Here!!!!' });
});

router.post('/results', (req, res) => { //Re-Directs to location=[LOCATION] below...
    console.log(req.body)
    res.redirect(`/food/location=${req.body.cityBox}`)      
});

router.get('/location=:city', (req, res) => { //Re-Directs HERE and gets the listing

    var config = {
        method: 'get',
        url: `https://api.yelp.com/v3/businesses/search?term=restaurants&location=${req.params.city}&limit=10`,
        headers: { 
            'Authorization': `Bearer ${YELP_API_KEY}`
        }
    };

    axios(config)
    .then((response) => {
        //console.log(JSON.stringify(response.data.businesses) + '  <--Response')
        res.render('food/foodListings', {
            city: req.params.city,
            restaurants: response.data.businesses
        })
    })
    .catch(function (error) {
        console.log(error);
        res.redirect('/')
    });

})

//API call to get food place info by ID
router.get('/location=:city/id=:id', async (req, res) => {
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
        console.log(restaurant) // This is the Restaurant info in Json format!!!
        res.render("food/foodShow", {
            restaurant,
            location: restaurant.location
        })


    }catch (err){
        console.log(err);
        res.redirect('/')
    }

 
})


// router.get('/:id', async (req, res, next) => {
//     const { id } = req.params;
  
//     try {
//       const { data: movie } = await axios.get(
//         `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
//       );
//       // const movieData = movie.data;
//       console.log(movie);
//       res.render('movies/show', {
//         movie,
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   });




module.exports = router;