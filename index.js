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

// Show all records of this type
app.get('/', async (req, res) => {
    const viewData = {records: [], axiosError: null}
    const restaurants = '/crm/v3/objects/2-41953822?properties=name&properties=city&properties=region';
    try {
        let resp;
        let after = 0;
        do {
            resp = await axios.get(restaurants + '&after='+after, {});
            resp.data.results.forEach((record) => {
                viewData.records.push(record);
            })

            // we are at the last page
            if (typeof resp.data.paging == 'undefined') {
                break;
            }

            // update cursor for next request
            after = resp.data.paging.next.after;
        } while (true)
    } catch (err) {
        viewData.axiosError = err.message;
    }
    res.render('homepage', {data: viewData});
})

// Display form to create new record
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'});
})

// post data to hubspot
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