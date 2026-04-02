import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const FALLBACK = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800';

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'All') params.status = statusFilter;
      const { data } = await api.get('/recipes/admin/all', { params });
      setRecipes(data);
    } catch {
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/recipes/admin/${id}/status`, { status });
      setRecipes(prev => prev.map(r => r._id === id ? data : r));
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this recipe?')) return;
    try {
      await api.delete(`/recipes/${id}`);
      setRecipes(prev => prev.filter(r => r._id !== id));
    } catch {
      alert('Failed to delete recipe');
    }
  };

  const pending = recipes.filter(r => r.status === 'pending').length;
  const approved = recipes.filter(r => r.status === 'approved').length;
  const rejected = recipes.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Manage Recipes</h1>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Pending', count: pending, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
          { label: 'Approved', count: approved, color: 'bg-green-100 text-green-700 border-green-200' },
          { label: 'Rejected', count: rejected, color: 'bg-red-100 text-red-700 border-red-200' },
        ].map(b => (
          <div key={b.label} className={`px-4 py-2 rounded-xl border text-sm font-medium ${b.color}`}>
            {b.label}: {b.count}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          {['All', 'pending', 'approved', 'rejected'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No recipes found.</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Recipe</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Author</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recipes.map(recipe => (
                  <tr key={recipe._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={recipe.imageUrl || FALLBACK}
                          alt={recipe.title}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          onError={e => { e.target.src = FALLBACK; }}
                        />
                        <span className="font-medium text-gray-800 line-clamp-1">{recipe.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{recipe.category}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{recipe.author?.name}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                      {new Date(recipe.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[recipe.status]}`}>
                        {recipe.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => navigate(`/recipes/${recipe._id}`)}
                          title="View"
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye size={16} />
                        </button>
                        {recipe.status !== 'approved' && (
                          <button
                            onClick={() => updateStatus(recipe._id, 'approved')}
                            title="Approve"
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {recipe.status !== 'rejected' && (
                          <button
                            onClick={() => updateStatus(recipe._id, 'rejected')}
                            title="Reject"
                            className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(recipe._id)}
                          title="Delete"
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRecipes;
