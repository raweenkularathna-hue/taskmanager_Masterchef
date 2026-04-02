import { Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FALLBACK = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800';

const categoryColors = {
  Italian: 'bg-green-100 text-green-700',
  Asian: 'bg-yellow-100 text-yellow-700',
  Mexican: 'bg-red-100 text-red-700',
  Desserts: 'bg-pink-100 text-pink-700',
  American: 'bg-blue-100 text-blue-700',
  Mediterranean: 'bg-cyan-100 text-cyan-700',
  Indian: 'bg-orange-100 text-orange-700',
  Other: 'bg-gray-100 text-gray-700',
};

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
      onClick={() => navigate(`/recipes/${recipe._id}`)}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={recipe.imageUrl || FALLBACK}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = FALLBACK; }}
        />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[recipe.category] || 'bg-gray-100 text-gray-700'}`}>
          {recipe.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 line-clamp-1">{recipe.title}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{recipe.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Clock size={14} />
            <span>{recipe.cookingTime} min</span>
          </div>
          <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
            <Eye size={14} />
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
