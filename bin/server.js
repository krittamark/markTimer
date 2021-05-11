const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);

const server = (port) => {
    app.disable('x-powered-by');
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/../interface.html'));
    });
    app.use(express.static('public'));
    
    const socket = require('../middleware/socket')(http);

    http.listen(port, () => console.log(`Timer listening on port ${port}`))
    return http;
};

module.exports = server;