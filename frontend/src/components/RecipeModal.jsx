import { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Upload, Image } from 'lucide-react';
import api from '../api/axios';

const CATEGORIES = ['Italian', 'Asian', 'Mexican', 'Desserts', 'American', 'Mediterranean', 'Indian', 'Other'];

const empty = {
  title: '',
  description: '',
  category: 'Italian',
  cookingTime: '',
  imageUrl: '',
  ingredients: [''],
  instructions: [''],
};

const RecipeModal = ({ recipe, onClose, onSaved }) => {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (recipe) {
      setForm({
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cookingTime: recipe.cookingTime,
        imageUrl: recipe.imageUrl || '',
        ingredients: recipe.ingredients.length ? recipe.ingredients : [''],
        instructions: recipe.instructions.length ? recipe.instructions : [''],
      });
      // Show existing image as preview
      if (recipe.imageUrl) setImagePreview(recipe.imageUrl);
    }
  }, [recipe]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleList = (field, index, value) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const addItem = (field) => setForm({ ...form, [field]: [...form[field], ''] });

  const removeItem = (field, index) => {
    const updated = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: updated.length ? updated : [''] });
  };

  // Handle file selected from disk
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type client-side
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setError('Only image files are allowed (jpg, png, webp, gif)');
      return;
    }
    // Validate size client-side (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setError('');
    setImageFile(file);
    // Show local preview immediately
    setImagePreview(URL.createObjectURL(file));
    // Clear any previously typed URL
    setForm(f => ({ ...f, imageUrl: '' }));
  };

  // Upload image to backend, get back the hosted URL
  const uploadImage = async () => {
    if (!imageFile) return form.imageUrl;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const { data } = await api.post('/recipes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.imageUrl;
    } catch {
      throw new Error('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Upload image first if a file was selected
      const finalImageUrl = await uploadImage();

      const payload = {
        ...form,
        imageUrl: finalImageUrl,
        cookingTime: Number(form.cookingTime),
        ingredients: form.ingredients.filter(Boolean),
        instructions: form.instructions.filter(Boolean),
      };

      if (recipe) {
        await api.put(`/recipes/${recipe._id}`, payload);
      } else {
        await api.post('/recipes', payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setForm(f => ({ ...f, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">{recipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cooking Time (minutes) *</label>
              <input name="cookingTime" type="number" min="1" value={form.cookingTime} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>

            {/* IMAGE UPLOAD SECTION */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Image</label>

              {/* Preview */}
              {imagePreview ? (
                <div className="relative mb-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                  {imageFile && (
                    <div className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                      <Image size={12} /> {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
                    </div>
                  )}
                </div>
              ) : null}

              {/* Upload button */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition"
              >
                <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500 font-medium">Click to upload an image</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, GIF — max 5MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* OR divider + URL fallback */}
              <div className="flex items-center gap-3 my-3">
                <hr className="flex-1 border-gray-200" />
                <span className="text-xs text-gray-400">or paste a URL instead</span>
                <hr className="flex-1 border-gray-200" />
              </div>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={e => {
                  handleChange(e);
                  // If they type a URL, clear any file selection
                  if (e.target.value) {
                    setImageFile(null);
                    setImagePreview(e.target.value);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  } else {
                    setImagePreview('');
                  }
                }}
                placeholder="https://example.com/food.jpg"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients *</label>
            <div className="space-y-2">
              {form.ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <input value={ing} onChange={e => handleList('ingredients', i, e.target.value)}
                    placeholder={`Ingredient ${i + 1}`}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  <button type="button" onClick={() => removeItem('ingredients', i)}
                    className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => addItem('ingredients')}
              className="mt-2 flex items-center gap-1 text-orange-500 text-sm hover:text-orange-700">
              <Plus size={15} /> Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructions *</label>
            <div className="space-y-2">
              {form.instructions.map((inst, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="mt-2 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                  <textarea value={inst} onChange={e => handleList('instructions', i, e.target.value)}
                    placeholder={`Step ${i + 1}`} rows={2}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
                  <button type="button" onClick={() => removeItem('instructions', i)}
                    className="mt-2 text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => addItem('instructions')}
              className="mt-2 flex items-center gap-1 text-orange-500 text-sm hover:text-orange-700">
              <Plus size={15} /> Add Step
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading || uploading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition">
              {uploading ? 'Uploading image...' : loading ? 'Saving...' : recipe ? 'Update Recipe' : 'Submit Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeModal;
