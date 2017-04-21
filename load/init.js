'use strict';

import mongoose from 'mongoose';

import dropData from './dropData';
import importData from './importData';
import config from '../src/config';

const MONGO_URL = config.dev.mongoURL;

mongoose.connection.on('open', () => {
	console.log('Connected to mongo server!');
	processData();
  return;
});

mongoose.connection.on('error', err => {
	console.log('Could not connect to mongo server!');
	return console.log(err.message);
});

try {
	mongoose.connect('mongodb://' + MONGO_URL);

	console.log('Started connection on ' + ('mongodb://' + MONGO_URL) + ', waiting for it to open...');
} catch (err) {
	console.log(('Setting up failed to connect to ' + MONGO_URL), err.message);
}

const gracefulExit = () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection with DB :' + MONGO_URL + ' is disconnected through app termination');
    process.exit(0);
  });
};

// If the Node process ends, close the Mongoose connection
process
	.on('SIGINT', gracefulExit)
	.on('SIGTERM', gracefulExit);

const processData = () => {
	dropData.execute()
		.then(() => {
			console.log('All data ereased');
			return importData.execute();
		})
		.then(() => {
			console.log('All data imported');
		})
		.catch(err => {
			console.log('Data processing failed...', err);
		})
		.then(() => {
			mongoose.connection.close();
		});
};
