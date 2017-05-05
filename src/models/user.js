import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
	username: { type: String, unique: true },
	email: { type: String, unique: true },
	firstName: String,
	lastName: String,
	password: String,
	location: String,
	interests: Array,
	allowEmailNotifications: Boolean,
	allowPushNotifications: Boolean,
	createdAt: Date,
	updatedAt: {
		type: Date,
		default: Date.now
	},
	isAdmin: Boolean
});

export default mongoose.model('Users', UserSchema);
