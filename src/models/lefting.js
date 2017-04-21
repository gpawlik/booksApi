import mongoose, { Schema } from 'mongoose';

const LeftingSchema = new Schema({
  description: String,
  bookId: String,
  location: String,
  status: String,
  createdAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Lefting', LeftingSchema);
