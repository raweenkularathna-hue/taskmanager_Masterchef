import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2 text-orange-400 font-bold text-lg">
        <span>MasterChef Recipe</span>
      </div>
      <p className="text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Recipe Share &mdash; Master Chef recipe
      </p>
      <div className="flex gap-4 text-sm">
        <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <Link to="/login" className="hover:text-orange-400 transition-colors">Login</Link>
        <Link to="/register" className="hover:text-orange-400 transition-colors">Register</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
