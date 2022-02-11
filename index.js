const express = require('express');

const app = express();

app.get('/', (request, response) => {
    response.status(200).json({msg: "It works !"});
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});