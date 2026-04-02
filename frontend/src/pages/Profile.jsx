import { useState, useEffect, useCallback } from 'react';
import { User, BookOpen, Save, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import RecipeModal from '../components/RecipeModal';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const FALLBACK = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800';

const Profile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  // Recipes
  const [recipes, setRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editRecipe, setEditRecipe] = useState(null);

  const fetchMyRecipes = useCallback(async () => {
    setRecipesLoading(true);
    try {
      const { data } = await api.get('/recipes/my');
      setRecipes(data);
    } catch {
      setRecipes([]);
    } finally {
      setRecipesLoading(false);
    }
  }, []);

  useEffect(() => { if (tab === 'recipes') fetchMyRecipes(); }, [tab, fetchMyRecipes]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg('');
    try {
      const { data } = await api.put('/auth/profile', profileForm);
      login(data);
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return setPwMsg('New passwords do not match');
    if (pwForm.newPassword.length < 6)
      return setPwMsg('Password must be at least 6 characters');
    setPwLoading(true);
    setPwMsg('');
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMsg(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await api.delete(`/recipes/${id}`);
      setRecipes(r => r.filter(r => r._id !== id));
    } catch {
      alert('Failed to delete recipe');
    }
  };

  const totalRecipes = recipes.length;
  const approved = recipes.filter(r => r.status === 'approved').length;
  const pending = recipes.filter(r => r.status === 'pending').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">{user?.name}</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
            {user?.role === 'admin' ? 'Administrator' : 'Member'}
          </span>
        </div>
        <div className="hidden sm:flex gap-6 text-center">
          <div><p className="text-2xl font-bold text-gray-800">{totalRecipes}</p><p className="text-xs text-gray-400">Total</p></div>
          <div><p className="text-2xl font-bold text-green-600">{approved}</p><p className="text-xs text-gray-400">Approved</p></div>
          <div><p className="text-2xl font-bold text-yellow-500">{pending}</p><p className="text-xs text-gray-400">Pending</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {[{ key: 'profile', label: 'My Profile', icon: User }, { key: 'recipes', label: 'My Recipes', icon: BookOpen }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.key ? 'bg-white shadow text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}>
            <t.icon size={16} />{t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">Profile Information</h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              {profileMsg && (
                <p className={`text-sm ${profileMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{profileMsg}</p>
              )}
              <button type="submit" disabled={profileLoading}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 disabled:opacity-50">
                <Save size={15} />{profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {['Current Password', 'New Password', 'Confirm New Password'][i]}
                  </label>
                  <input type="password" value={pwForm[field]}
                    onChange={e => setPwForm({ ...pwForm, [field]: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              ))}
              {pwMsg && (
                <p className={`text-sm ${pwMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{pwMsg}</p>
              )}
              <button type="submit" disabled={pwLoading}
                className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                <Save size={15} />{pwLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Recipes Tab */}
      {tab === 'recipes' && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-gray-800">My Recipes</h2>
            <button onClick={() => { setEditRecipe(null); setShowModal(true); }}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition">
              <Plus size={16} /> Add Recipe
            </button>
          </div>

          {recipesLoading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p>You haven't submitted any recipes yet.</p>
              <button onClick={() => { setEditRecipe(null); setShowModal(true); }}
                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-orange-600">
                Add Your First Recipe
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map(r => (
                <div key={r._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="relative h-40 cursor-pointer" onClick={() => navigate(`/recipes/${r._id}`)}>
                    <img src={r.imageUrl || FALLBACK} alt={r.title}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = FALLBACK; }} />
                    <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{r.title}</h3>
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">{r.description}</p>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/recipes/${r._id}`)}
                        className="flex-1 flex items-center justify-center gap-1 border border-gray-200 text-gray-600 py-1.5 rounded-lg text-xs hover:bg-gray-50">
                        <Eye size={13} /> View
                      </button>
                      <button onClick={() => { setEditRecipe(r); setShowModal(true); }}
                        className="flex-1 flex items-center justify-center gap-1 border border-blue-200 text-blue-600 py-1.5 rounded-lg text-xs hover:bg-blue-50">
                        <Pencil size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(r._id)}
                        className="flex-1 flex items-center justify-center gap-1 border border-red-200 text-red-500 py-1.5 rounded-lg text-xs hover:bg-red-50">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <RecipeModal
          recipe={editRecipe}
          onClose={() => setShowModal(false)}
          onSaved={fetchMyRecipes}
        />
      )}
    </div>
  );
};

export default Profile;
