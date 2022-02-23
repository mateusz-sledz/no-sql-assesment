const express = require('express');
const { type } = require('express/lib/response');
const { count } = require('../models/Continent');
const ContinentModel = require('../models/Continent');
const router = express.Router()

const CountryModel = require('../models/Country')

// get countries with substring
router.get('/withstring/:s', async (request, response) =>{
    const str = request.params.s;

    const countries = await CountryModel.find(
        { 
            "name": { "$regex": str, "$options": "i" }
     }
    );

    response.status(200).json(countries);
});

// get countries with substring "u", and population > 100 k
router.get('/100k', async (request, response) =>{

    const countries = await CountryModel.find(
        { 
            "name": { "$regex": "u", "$options": "i" },
            "population": { $gt: 0.1}
        }
     );

    response.status(200).json(countries);
});

// get first four countries of sorted list of countries on given continent
router.get('/sortbyname/:continent', async (request, response) =>{
    const continent = request.params.continent;

    const countries = await ContinentModel.find(
        { "name": continent }
    ).populate('countries');

    var result = countries[0].countries

    result = await result.sort(function(a,b){ 
        var x = a.name < b.name? -1:1; 
        return x; 
    });

    response.status(200).json(result.slice(0, 4));
});

// get all countries in ascending population order
router.get('/populations', async (request, response) =>{

    const countries = await CountryModel.find({});

    const result = countries.sort(function(a,b){ 
        var x = a.population <= b.population? -1:1; 
        return x; 
    });

    response.status(200).json(result);

})

router.get('/', async (request, response) => {
    const countries = await CountryModel.find();
    response.status(200).json(countries);
});

router.get('/:id', async (request, response) => {
    const countryId = request.params.id;

    const countries = await CountryModel.findOne({
        _id: countryId
    });
    
    response.status(200).json(countries);
});

router.post('/', async (request, response) => {
    const {name, isoCode, continent} = request.body
    const country = await CountryModel.create({
        name: name,
        isoCode,
        continent
    });

    const cont = await ContinentModel.updateOne(
        { _id: continent },
        { $push: { countries: country._id } }
        ,{
            new: true
        }
    );

    response.status(200).json(country);
});

router.delete('/:id', async (request, response) => {
    const countryId = request.params.id;
    const country = await CountryModel.findById({_id: countryId})
    const continentID = country.continent

    console.log("country: " + continentID)

    await ContinentModel.updateOne(
        { _id: continentID},
        { $pull: {countries: countryId} }
    )

    await CountryModel.findOneAndDelete({
        _id: countryId
    });

    response.status(200).json({msg: 'Country well deleted !'});
});

router.put('/:id', async (request, response) => {
    const countryId = request.params.id;
    const {name, isoCode} = request.body

    const country = await CountryModel.findOneAndUpdate({
        _id: countryId
    },{
        name,
        isoCode
    },{
        new: true
    });

    response.status(200).json(country);
});

module.exports = router;