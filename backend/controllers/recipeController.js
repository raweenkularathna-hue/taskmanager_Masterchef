const Recipe = require('../models/Recipe');

// @desc Get all approved recipes (public)
// @route GET /api/recipes
const getApprovedRecipes = async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = { status: 'approved' };

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const recipes = await Recipe.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single recipe by id
// @route GET /api/recipes/:id
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'name email');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create recipe
// @route POST /api/recipes
const createRecipe = async (req, res) => {
  try {
    const { title, description, category, cookingTime, imageUrl, ingredients, instructions } = req.body;
    const recipe = await Recipe.create({
      title,
      description,
      category,
      cookingTime,
      imageUrl,
      ingredients,
      instructions,
      author: req.user._id,
      status: 'pending',
    });
    const populated = await recipe.populate('author', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update recipe (owner or admin)
// @route PUT /api/recipes/:id
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const { title, description, category, cookingTime, imageUrl, ingredients, instructions } = req.body;
    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.category = category || recipe.category;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.imageUrl = imageUrl !== undefined ? imageUrl : recipe.imageUrl;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    // Reset to pending on edit if not admin
    if (req.user.role !== 'admin') recipe.status = 'pending';

    const updated = await recipe.save();
    await updated.populate('author', 'name email');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete recipe
// @route DELETE /api/recipes/:id
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get current user's recipes
// @route GET /api/recipes/my
const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- ADMIN ROUTES ----

// @desc Get all recipes (admin)
// @route GET /api/recipes/admin/all
const getAllRecipes = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
      ];
    }
    const recipes = await Recipe.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update recipe status (admin)
// @route PUT /api/recipes/admin/:id/status
const updateRecipeStatus = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    recipe.status = req.body.status;
    await recipe.save();
    await recipe.populate('author', 'name email');
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getApprovedRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
  getAllRecipes,
  updateRecipeStatus,
};
