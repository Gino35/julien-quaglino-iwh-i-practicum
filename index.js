require('dotenv').config()
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.

// set axios default config for hubspot api call
axios.defaults.baseURL = 'https://api.hubapi.com';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + process.env.PRIVATE_APP_KEY;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    console.log('GET /homepage')
})

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'});
})

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const payload = {
        properties: {
            'name': req.body.name.trim(),
            'city': req.body.city.trim(),
            'region': req.body.region.trim()
        }
    }

    try {
        const createRestaurant = '/crm/v3/objects/2-41953822';
        await axios.post(createRestaurant, payload, {} );
        res.redirect('/');
    } catch(err) {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', axiosError: err.message});
    }
})

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));