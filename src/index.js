const express = require('express');
const consign = require('consign');

const app = express();

const db = require('./config/db');

consign().include('./src/config/passport.js')
.then('./src/config/middlewares.js')
.then('./src/api')
.then('./src/routes.js')
.into(app);

app.get('/', (req, res)=>{
    res.status(200).send('Meu bar');
});

app.db = db;

app.listen(3001, ()=>{
    console.log('Backend');
});
