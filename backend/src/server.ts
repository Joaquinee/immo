import http from 'http';
import app from './app';
import MongoDB from './models/db.model';
import chalk from 'chalk';
const normalizePort = (val: string) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};
const port = normalizePort(process.env.PORT ||'4000');
app.set('port', port);
const errorHandler = (error: { syscall: string; code: any; }) => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
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
const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
    MongoDB.createMongoDB();
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log(chalk.green('[OK] Listening on ' + bind));
});

server.listen(port);

