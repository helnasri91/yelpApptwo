const express = require('express');//Package express()
const PORT = process.env.PORT || 3030

require('dotenv').config()
//const firebase = require('./config/firebase')

const app = express();

const foodListRouter = require('./routes/foodRouter');
const { auth } = require('firebase');

// -- Implimenting Save Cookie, will be moved later..filters
var parseurl = require('parseurl')
var session = require('express-session')

app.use(session({
  secret: 'supercatafragilisticespieatadocious',
  resave: false,
  saveUninitialized: true
}))

app.use(function (req, res, next) {
//   if (!req.session.views) {
//     req.session.views = {}
//   }

//   // get the url pathname
//   var pathname = parseurl(req).pathname

//   // count the views
//   req.session.views[pathname] = (req.session.views[pathname] || 0) + 1

	if(!req.session.suggested) {
		req.session.suggested = []
	}

  next()
})

// app.get('/foo', function (req, res, next) {
//   res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
// })

// app.get('/bar', function (req, res, next) {
//   res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
// })



app.get('/test', function (req, res, next) {
	res.send('The site you saved was ' + ( req.session.suggested[0] || "None. Save a site to see it here"))
})


app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));


app.get('/', (req, res, next) => {
	res.render('index', { suggested:req.session.suggested });
});

//Impliment this partial to use sign in -  <%- include('signup/index') %>
app.post('/signup', (req, res, next) => {
console.log(req.body)
firebase.doCreateUserWithEmailAndPassword(req.body.email, req.body.password)
	.then(authUser => {
		console.log(authUser)
	}).catch(err => {
		req.app.locals.err = err.message
		res.redirect('/')
	})

})

app.get('/suggested', (req,res) => {
	res.render("user/suggested", {
		suggested: req.session.suggested
	})
})

app.use('/food', foodListRouter);
//app.use('/user/food', userRouter) - when a user would look food up


app.listen(PORT, (err) =>
	console.log(`${err ? err : `Running on port ${PORT}`}`),
)

/* 

--Google Auth w/ firebase....?
*/