const express = require('express');

const app = express();

app.get('/', (req, res) => {
	res.send('Hello');
});

app.get('/cat', (req,res) => {
    res.send('Roar!');
});

app.get('/gio' (req, res) => {
		res.send("This is My path. It's Mine. Leave now.");
})

app.listen(3030, (err) =>
	console.log(`${err ? err : 'Running on port 3030'}`),
);git
