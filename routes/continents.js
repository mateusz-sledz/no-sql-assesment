const express = require('express');
const router = express.Router()

const ContinentModel = require('../models/Continent')

// get number of cuntries in each continent
router.get('/countries', async (request, response) => {
    const continents = await ContinentModel.find({})
    var data = {}

    for (var i = 0; i < continents.length; i++) {
        var one = await continents[i].name
        var two = await continents[i].countries.length
        data[one] = two
      }

      response.status(200).json(data);
});


router.get('/', async (request, response) => {
    const continents = await ContinentModel.find().populate('countries');
    response.status(200).json(continents);
});

router.post('/', async (request, response) => {
    const {name} = request.body

    const continent = await ContinentModel.create({
        name: name
    });

    response.status(200).json(continent);
});

router.delete('/:id', async (request, response) => {
    const continentId = request.params.id;

    await ContinentModel.findOneAndDelete({
        _id: continentId
    });

    response.status(200).json({msg: 'Continent well deleted !'});
});

module.exports = router;