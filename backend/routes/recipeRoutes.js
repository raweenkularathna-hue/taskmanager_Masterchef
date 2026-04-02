const express = require('express');
const router = express.Router();
const {
  getApprovedRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
  getAllRecipes,
  updateRecipeStatus,
} = require('../controllers/recipeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public
router.get('/', getApprovedRecipes);
router.get('/my', protect, getMyRecipes);

// Admin
router.get('/admin/all', protect, adminOnly, getAllRecipes);
router.put('/admin/:id/status', protect, adminOnly, updateRecipeStatus);

// Image upload endpoint
router.post('/upload', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image file provided' });
  // Return the public URL path to the uploaded file
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Single recipe & CRUD
router.get('/:id', getRecipeById);
router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
