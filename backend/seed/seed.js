const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

dotenv.config();

// For now, Unsplash URLs are used as the fallback so the seed works out of the box.

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  await User.deleteMany();
  await Recipe.deleteMany();

  // Pass PLAIN TEXT passwords — User model pre('save') hook hashes them.
  const admin = await User.create({ name: 'Admin User', email: 'admin@recipe.com', password: 'admin123', role: 'admin' });
  const sarah = await User.create({ name: 'Sarah Johnson', email: 'sarah@recipe.com', password: 'user123', role: 'user' });
  const mike  = await User.create({ name: 'Mike Chen',     email: 'mike@recipe.com',  password: 'user123', role: 'user' });

  const recipes = [
    {
      title: 'Classic Spaghetti Carbonara',
      description: 'A rich and creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.',
      category: 'Italian',
      cookingTime: 30,
      // To use a local image: 'http://15.135.194.34:5001/uploads/carbonara.jpg'
      imageUrl: 'http://15.135.194.34:5001/uploads/Classic_Spaghetti_Carbonara.jpg',
      ingredients: ['400g spaghetti', '200g pancetta', '4 large eggs', '100g Pecorino Romano', '100g Parmesan', 'Black pepper', 'Salt'],
      instructions: ['Cook spaghetti in salted boiling water until al dente.', 'Fry pancetta until crispy.', 'Whisk eggs with grated cheese and pepper.', 'Drain pasta, reserving 1 cup pasta water.', 'Combine hot pasta with pancetta off heat.', 'Add egg mixture, tossing quickly with pasta water to create creamy sauce.', 'Serve immediately with extra cheese.'],
      author: sarah._id,
      status: 'approved',
    },
    {
      title: 'Chicken Tikka Masala',
      description: 'Tender chicken in a rich, creamy tomato-based sauce with aromatic Indian spices.',
      category: 'Indian',
      cookingTime: 50,
      imageUrl: 'http://15.135.194.34:5001/uploads/Chicken_Tikka_Masala.jpg',
      ingredients: ['600g chicken breast', '400ml coconut cream', '400g crushed tomatoes', '2 tbsp tikka masala paste', '1 onion', '3 garlic cloves', '1 tsp ginger', 'Coriander to garnish'],
      instructions: ['Marinate chicken in tikka paste for 30 minutes.', 'Grill or pan-fry chicken until charred.', 'Sauté onion, garlic, ginger until soft.', 'Add tomatoes and simmer 10 minutes.', 'Blend sauce until smooth, return to pan.', 'Add cream and chicken, simmer 15 minutes.', 'Garnish with fresh coriander.'],
      author: mike._id,
      status: 'approved',
    },
    {
      title: 'Chocolate Lava Cake',
      description: 'Decadent warm chocolate cake with a gooey molten center. Perfect for special occasions.',
      category: 'Desserts',
      cookingTime: 25,
      imageUrl: 'http://15.135.194.34:5001/uploads/Chocolate_Lava_Cake.jpg',
      ingredients: ['200g dark chocolate', '100g butter', '3 eggs', '3 egg yolks', '90g sugar', '50g flour', 'Cocoa powder for dusting', 'Vanilla ice cream to serve'],
      instructions: ['Preheat oven to 220°C. Grease 4 ramekins with butter and dust with cocoa.', 'Melt chocolate and butter together over a double boiler.', 'Beat eggs, yolks, and sugar until thick and pale.', 'Fold chocolate into egg mixture.', 'Fold in flour until just combined.', 'Pour into ramekins and bake 12 minutes.', 'Turn out onto plates and serve immediately with ice cream.'],
      author: sarah._id,
      status: 'approved',
    },
    {
      title: 'Beef Tacos',
      description: 'Crispy corn tortillas filled with seasoned ground beef, fresh salsa, and all the toppings.',
      category: 'Mexican',
      cookingTime: 20,
      imageUrl: 'http://15.135.194.34:5001/uploads/Beef_Tacos.jpg',
      ingredients: ['500g ground beef', '8 corn tortillas', '2 tbsp taco seasoning', 'Lettuce', 'Tomato', 'Cheddar cheese', 'Sour cream', 'Salsa'],
      instructions: ['Brown ground beef in a skillet over medium-high heat.', 'Drain fat, add taco seasoning and 1/4 cup water.', 'Simmer until sauce thickens, about 5 minutes.', 'Warm tortillas in a dry pan.', 'Fill tortillas with beef and desired toppings.', 'Serve immediately.'],
      author: mike._id,
      status: 'approved',
    },
    {
      title: 'Pad Thai',
      description: 'Classic Thai stir-fried noodles with shrimp, peanuts, eggs, and tangy tamarind sauce.',
      category: 'Asian',
      cookingTime: 25,
      imageUrl: 'http://15.135.194.34:5001/uploads/Pad_Thai.jpg',
      ingredients: ['200g rice noodles', '200g shrimp', '2 eggs', '3 tbsp tamarind paste', '2 tbsp fish sauce', '1 tbsp sugar', 'Bean sprouts', 'Spring onions', 'Crushed peanuts', 'Lime'],
      instructions: ['Soak noodles in warm water 20 minutes, drain.', 'Mix tamarind, fish sauce, and sugar for sauce.', 'Stir-fry shrimp until pink, set aside.', 'Scramble eggs in the wok.', 'Add noodles and sauce, toss well.', 'Add shrimp back in with bean sprouts.', 'Serve topped with peanuts, spring onion, and lime.'],
      author: sarah._id,
      status: 'approved',
    },
    {
      title: 'Greek Salad',
      description: 'Fresh Mediterranean salad with crisp vegetables, olives, and creamy feta cheese.',
      category: 'Mediterranean',
      cookingTime: 10,
      imageUrl: 'http://15.135.194.34:5001/uploads/Greek_Salad.jpg',
      ingredients: ['2 cucumbers', '4 tomatoes', '1 red onion', '200g feta cheese', '100g Kalamata olives', '3 tbsp olive oil', '1 tbsp red wine vinegar', 'Dried oregano', 'Salt and pepper'],
      instructions: ['Chop cucumbers, tomatoes, and onion into chunks.', 'Combine in a large bowl.', 'Add olives and crumble feta over the top.', 'Whisk olive oil, vinegar, oregano, salt, and pepper.', 'Drizzle dressing over salad.', 'Toss gently and serve.'],
      author: mike._id,
      status: 'approved',
    },
    {
      title: 'Buttermilk Pancakes',
      description: 'Fluffy, golden pancakes with a crispy edge. Perfect weekend breakfast with maple syrup.',
      category: 'American',
      cookingTime: 20,
      imageUrl: 'http://15.135.194.34:5001/uploads/Buttermilk_Pancakes.jpg',
      ingredients: ['2 cups flour', '2 tbsp sugar', '1 tsp baking powder', '1/2 tsp baking soda', '1/2 tsp salt', '2 cups buttermilk', '2 eggs', '3 tbsp melted butter', 'Maple syrup to serve'],
      instructions: ['Whisk dry ingredients in a large bowl.', 'Whisk buttermilk, eggs, and butter in another bowl.', 'Fold wet into dry until just combined (lumps are fine).', 'Heat a greased griddle over medium heat.', 'Pour 1/4 cup batter per pancake.', 'Cook until bubbles form on surface, flip and cook 1 more minute.', 'Serve with maple syrup and butter.'],
      author: sarah._id,
      status: 'approved',
    },
    {
      title: 'Mushroom Risotto',
      description: 'Creamy Italian rice dish with mixed mushrooms, parmesan, and fresh herbs.',
      category: 'Italian',
      cookingTime: 40,
      imageUrl: 'http://15.135.194.34:5001/uploads/Mushroom_Risotto.jpg',
      ingredients: ['300g Arborio rice', '400g mixed mushrooms', '1L vegetable stock', '1 onion', '3 garlic cloves', '150ml white wine', '80g Parmesan', '30g butter', 'Fresh thyme', 'Salt and pepper'],
      instructions: ['Keep stock warm in a separate pot.', 'Saute mushrooms until golden, set aside.', 'Fry onion and garlic in butter until soft.', 'Add rice, stir to coat. Pour in wine and stir until absorbed.', 'Add stock one ladle at a time, stirring until each is absorbed.', 'After 18-20 minutes, rice should be creamy and al dente.', 'Stir in mushrooms, Parmesan, and butter. Season to taste.'],
      author: mike._id,
      status: 'pending',
    },
  ];

  await Recipe.insertMany(recipes);
  console.log('Seed complete!');
  console.log('Admin: admin@recipe.com / admin123');
  console.log('User 1: sarah@recipe.com / user123');
  console.log('User 2: mike@recipe.com / user123');
  console.log('');
  console.log('3. Run npm run seed again');
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
