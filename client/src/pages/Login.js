import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Login() {
  const [user, setUser] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/auth/login', user)
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify({ email: user.email }));
        navigate('/');
      })
      .catch((err) => {
        setError('Login failed. Please check your credentials and try again.');
        console.error(err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-500 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-white mb-1">Email</label>
            <input 
              id="email"
              name="email"
              type="email"
              placeholder="Email" 
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-white bg-opacity-20 placeholder-white text-white focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white mb-1">Password</label>
            <input 
              id="password"
              name="password"
              type="password"
              placeholder="Password" 
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-white bg-opacity-20 placeholder-white text-white focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition duration-300 py-3 rounded text-white font-bold"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
