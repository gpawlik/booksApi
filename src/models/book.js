import mongoose, { Schema } from 'mongoose';

const BookSchema = new Schema({
  bookId: String,
  title: String,
  description: String,
  author: String,
  ISBN: String,
  imageUrl: String,
  publishDate: Number,
  rating: Number,
  createdAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Book', BookSchema);
