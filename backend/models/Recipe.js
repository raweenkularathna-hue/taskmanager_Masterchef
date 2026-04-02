const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Italian', 'Asian', 'Mexican', 'Desserts', 'American', 'Mediterranean', 'Indian', 'Other'],
    },
    cookingTime: { type: Number, required: true }, // in minutes
    imageUrl: { type: String, default: '' },
    ingredients: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);
