import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow flex justify-between items-center">
      <h1 className="text-2xl font-bold">📈 MyStockTrainer</h1>
      <div className="space-x-4 text-sm">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <Link to="/login" className="hover:text-blue-400">Login</Link>
        <Link to="/signup" className="hover:text-blue-400">Sign Up</Link>
      </div>
    </nav>
  );
}

export default Navbar;
