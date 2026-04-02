import { useState, useEffect } from 'react';
import { Search} from 'lucide-react';
import api from '../api/axios';
import RecipeCard from '../components/RecipeCard';

const CATEGORIES = ['All', 'Italian', 'Asian', 'Mexican', 'Desserts', 'American', 'Mediterranean', 'Indian', 'Other'];

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [searchInput, setSearchInput] = useState('');

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await api.get('/recipes', { params });
      setRecipes(data);
    } catch {
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecipes(); }, [search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Discover Amazing Recipes</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Explore delicious recipes from home cooks around the world.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search recipes..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <button type="submit" className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600 transition">
          Search
        </button>
        {search && (
          <button type="button" onClick={() => { setSearch(''); setSearchInput(''); }}
            className="border border-gray-300 text-gray-600 px-3 py-2.5 rounded-xl text-sm hover:bg-gray-50">
            Clear
          </button>
        )}
      </form>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              category === cat
                ? 'bg-orange-500 text-white shadow'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100">
              <div className="bg-gray-200 h-48 rounded-t-2xl" />
              <div className="p-4 space-y-2">
                <div className="bg-gray-200 h-4 rounded w-3/4" />
                <div className="bg-gray-200 h-3 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No recipes found. Try a different search or category.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map(recipe => <RecipeCard key={recipe._id} recipe={recipe} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
