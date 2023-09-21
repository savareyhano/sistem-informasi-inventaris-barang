const express = require('express');
const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4:uuidv4 } = require("uuid");

const router = require('./router');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

app.set('view engine', 'ejs');

// load static assets
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))
app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use('/js', express.static(path.join(__dirname, 'public/js')))

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

app.use('/plugins', express.static(path.join(__dirname, 'public/plugins')))
app.use('/dist', express.static(path.join(__dirname, 'public/dist')))

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));

// app.use('/route', router);

app.use(router);

// home route
// app.get('/', (req, res)=>{
//     res.render('login', { title : "Login"})
// })

app.use('/', (req, res) => {
    res.status(404)
    res.render('error_page/404', { title : "404 Error"})
})

app.listen(port, ()=>{ console.log("Listening to the server on http://localhost:3000")});