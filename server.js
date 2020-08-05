

const express = require('express');

const app = express();

//Tells Node that we want to be able to accept json files into express
app.use(express.json)
//Same, except this allows form data. Extended is for nested objects within json files
app.use(express.urlencoded({ extended: false}))


app.get('/', (req, res) => {
	res.send('Hello');
});

app.get('/cat', (req,res) => {
    res.send('Roar!');
});

app.listen(3030, (err) =>
	console.log(`${err ? err : 'Running on port 3030'}`),
);


'use strict';

const yelp = require('yelp-fusion');
const client = yelp.client('8HK6eeaWVT8HC1r9Ekuub33eP8OVbDrhWy_TGyjF7fdbQNzhSPiVyJyoEqgXioekmG7l5RoNfbqDmyNk3tu2CK2tEcyWBj0YfbpgpxNFNtQ4BDDb84Sv1MH5lhorX3Yx');

client.search({
  term: 'Four Barrel Coffee',
  location: 'san francisco, ca',
}).then(response => {
  console.log(response.jsonBody.businesses[0].name);
}).catch(e => {
  console.log(e);
});

