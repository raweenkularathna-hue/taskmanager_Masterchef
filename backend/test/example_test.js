
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Recipe = require('../models/Recipe');
const { createRecipe, updateRecipe, getMyRecipes, deleteRecipe } = require('../controllers/recipeController');
const { expect } = chai;

chai.use(chaiHttp);

describe('CreateRecipe Function Test', () => {
  it('should create a new recipe successfully', async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        title: 'New Recipe',
        description: 'Recipe description',
        category: 'Italian',
        cookingTime: 30,
        imageUrl: '',
        ingredients: ['Pasta', 'Cheese'],
        instructions: ['Boil pasta', 'Mix ingredients'],
      },
    };

    const createdRecipe = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
      author: req.user._id,
      status: 'pending',
      populate: sinon.stub().resolvesThis(),
    };

    const createStub = sinon.stub(Recipe, 'create').resolves(createdRecipe);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createRecipe(req, res);

    expect(createStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdRecipe)).to.be.true;

    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    const createStub = sinon.stub(Recipe, 'create').throws(new Error('DB Error'));

    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        title: 'New Recipe',
        description: 'Recipe description',
        category: 'Italian',
        cookingTime: 30,
        ingredients: ['Pasta'],
        instructions: ['Cook'],
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createRecipe(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    createStub.restore();
  });
});

describe('UpdateRecipe Function Test', () => {
  it('should update recipe successfully', async () => {
    const recipeId = new mongoose.Types.ObjectId();
    const ownerId = new mongoose.Types.ObjectId();

    const existingRecipe = {
      _id: recipeId,
      title: 'Old Recipe',
      description: 'Old Description',
      category: 'Italian',
      cookingTime: 15,
      imageUrl: '',
      ingredients: ['Old ingredient'],
      instructions: ['Old step'],
      author: ownerId,
      status: 'approved',
      save: sinon.stub().resolvesThis(),
      populate: sinon.stub().resolvesThis(),
    };

    const findByIdStub = sinon.stub(Recipe, 'findById').resolves(existingRecipe);

    const req = {
      params: { id: recipeId.toString() },
      user: { _id: ownerId, role: 'user' },
      body: { title: 'New Recipe', cookingTime: 25 },
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await updateRecipe(req, res);

    expect(existingRecipe.title).to.equal('New Recipe');
    expect(existingRecipe.cookingTime).to.equal(25);
    expect(existingRecipe.status).to.equal('pending');
    expect(res.json.calledOnce).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if recipe is not found', async () => {
    const findByIdStub = sinon.stub(Recipe, 'findById').resolves(null);

    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { _id: new mongoose.Types.ObjectId(), role: 'user' },
      body: {},
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateRecipe(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Recipe not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Recipe, 'findById').throws(new Error('DB Error'));

    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { _id: new mongoose.Types.ObjectId(), role: 'user' },
      body: {},
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateRecipe(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findByIdStub.restore();
  });
});

describe('GetMyRecipes Function Test', () => {
  it('should return recipes for the given user', async () => {
    const userId = new mongoose.Types.ObjectId();
    const recipes = [
      { _id: new mongoose.Types.ObjectId(), title: 'Recipe 1', author: userId },
      { _id: new mongoose.Types.ObjectId(), title: 'Recipe 2', author: userId },
    ];

    const sortStub = sinon.stub().resolves(recipes);
    const populateStub = sinon.stub().returns({ sort: sortStub });
    const findStub = sinon.stub(Recipe, 'find').returns({ populate: populateStub });

    const req = { user: { _id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await getMyRecipes(req, res);

    expect(findStub.calledOnceWith({ author: userId })).to.be.true;
    expect(res.json.calledWith(recipes)).to.be.true;
    expect(res.status.called).to.be.false;

    findStub.restore();
  });

  it('should return 500 on error', async () => {
    const findStub = sinon.stub(Recipe, 'find').throws(new Error('DB Error'));

    const req = { user: { _id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await getMyRecipes(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findStub.restore();
  });
});

describe('DeleteRecipe Function Test', () => {
  it('should delete a recipe successfully', async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { _id: ownerId, role: 'user' },
    };

    const recipe = { author: ownerId, deleteOne: sinon.stub().resolves() };
    const findByIdStub = sinon.stub(Recipe, 'findById').resolves(recipe);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteRecipe(req, res);

    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(recipe.deleteOne.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Recipe deleted' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 404 if recipe is not found', async () => {
    const findByIdStub = sinon.stub(Recipe, 'findById').resolves(null);

    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { _id: new mongoose.Types.ObjectId(), role: 'user' },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteRecipe(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Recipe not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    const findByIdStub = sinon.stub(Recipe, 'findById').throws(new Error('DB Error'));

    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { _id: new mongoose.Types.ObjectId(), role: 'user' },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await deleteRecipe(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    findByIdStub.restore();
  });
});