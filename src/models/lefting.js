import mongoose, { Schema } from 'mongoose';

const LeftingSchema = new Schema({
  comment: String,
  bookId: String,
  userId: String,
  locationString: String,
  location: Object,
  pictureUrl: String,
  status: String,
  createdAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Lefting', LeftingSchema);
