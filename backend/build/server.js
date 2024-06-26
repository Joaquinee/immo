"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var app_1 = __importDefault(require("./app"));
var db_model_1 = __importDefault(require("./models/db.model"));
var normalizePort = function (val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
var port = normalizePort(process.env.PORT || '4000');
app_1.default.set('port', port);
var errorHandler = function (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var address = server.address();
    var bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};
var server = http_1.default.createServer(app_1.default);
server.on('error', errorHandler);
server.on('listening', function () {
    db_model_1.default.createMongoDB();
    var address = server.address();
    var bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});
server.listen(port);
