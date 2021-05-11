const express = require('express');
const app = express();
const http = require('http').Server(app);

const server = (port) => {
    app.set('view engine', 'pug');
    app.disable('x-powered-by');
    const index = require('../routes/index');
    //const api = require('../routes/api');
    app.use('/', index);
    //app.use('api', api);

    app.use(express.static('public'));
    
    const socket = require('../middleware/socket')(http);

    http.listen(port, () => console.log(`Timer listening on port ${port}`))
    return http;
};

module.exports = server;