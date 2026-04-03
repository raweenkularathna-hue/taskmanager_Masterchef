import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminRecipes from './pages/admin/AdminRecipes';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected User */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Protected Admin */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminRecipes /></ProtectedRoute>} />
            <Route path="/admin/recipes" element={<ProtectedRoute adminOnly><AdminRecipes /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
