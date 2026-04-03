import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Tag, Calendar, Heart } from 'lucide-react';
import api from '../api/axios';

const FALLBACK = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await api.get(`/recipes/${id}`);
        setRecipe(data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
      <div className="bg-gray-200 h-80 rounded-2xl mb-8" />
      <div className="space-y-3">
        <div className="bg-gray-200 h-8 w-2/3 rounded" />
        <div className="bg-gray-200 h-4 w-full rounded" />
        <div className="bg-gray-200 h-4 w-3/4 rounded" />
      </div>
    </div>
  );

  if (!recipe) return null;

  const authorName = recipe.author?.name || 'Unknown';
  const formattedDate = new Date(recipe.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Recipes
      </button>

      {/* Hero Image */}
      <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 mb-8 shadow-md">
        <img
          src={recipe.imageUrl || FALLBACK}
          alt={recipe.title}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = FALLBACK; }}
        />
        <button
          onClick={() => setLiked(!liked)}
          className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition ${liked ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-400'}`}
        >
          <Heart size={20} fill={liked ? 'white' : 'none'} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-3xl font-bold text-gray-800">{recipe.title}</h1>
            </div>
            <p className="text-gray-500 text-lg leading-relaxed">{recipe.description}</p>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-gray-600 leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-gray-700 mb-2">Recipe Info</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Tag size={16} className="text-orange-500" />
              <span>{recipe.category}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock size={16} className="text-orange-500" />
              <span>{recipe.cookingTime} minutes</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <User size={16} className="text-orange-500" />
              <span>{authorName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar size={16} className="text-orange-500" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-bold text-gray-700 mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
