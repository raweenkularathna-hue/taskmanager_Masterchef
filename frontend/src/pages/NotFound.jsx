import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <div className="bg-orange-100 p-5 rounded-full mb-6">
    </div>
    <h1 className="text-6xl font-bold text-gray-200 mb-2">404</h1>
    <h2 className="text-2xl font-bold text-gray-700 mb-2">Page Not Found</h2>
    <p className="text-gray-400 mb-8 max-w-sm">
      Looks like this recipe page doesn't exist. Maybe it was deleted or never created.
    </p>
    <Link
      to="/"
      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition"
    >
      Back to Home
    </Link>
  </div>
);

export default NotFound;
