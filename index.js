require('dotenv').config();
const express = require('express');

require('./conf/database');

const app = express();
app.use(express.json());

const CountryModel = require('./models/Country')

app.get('/', (request, response) => {
    response.status(200).json({msg: "It works !"});
});

app.get('/countries', async (request, response) => {
    const countries = await CountryModel.find();
    response.status(200).json(countries);
});

app.get('/countries/:id', async (request, response) => {
    const countryId = request.params.id;

    const countries = await CountryModel.findOne({
        _id: countryId
    });
    
    response.status(200).json(countries);
});

app.post('/countries', async (request, response) => {
    const {name, isoCode} = request.body

    const country = await CountryModel.create({
        name: name,
        isoCode
    });

    response.status(200).json(country);
});

app.delete('/countries/:id', async (request, response) => {
    const countryId = request.params.id;

    await CountryModel.findOneAndDelete({
        _id: countryId
    });

    response.status(200).json({msg: 'Country well deleted !'});
});

app.put('/countries/:id', async (request, response) => {
    const countryId = request.params.id;
    const {name, isoCode} = request.body

    const country = await CountryModel.findOneAndUpdate({
        _id: countryId
    },{
        name,
        isoCode
    });

    response.status(200).json(country);
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});