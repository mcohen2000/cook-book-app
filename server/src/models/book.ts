import mongoose from 'mongoose';

const cookbookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Cookbook = mongoose.model('Cookbook', cookbookSchema);

export default Cookbook;
