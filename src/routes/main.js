import express from 'express';

const router = express.Router();

// Middleware to use for all requests
router.use((req, res, next) => {
	console.log('Something is happening.');
	next();
});

// Test route to make sure everything is working
router.get('/', (req, res) => {
	res.json({ message: 'hooray! welcome to our api!' });
});

export default router;
