import React, { useState } from 'react';
import { login, register } from './api/auth';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Formdaki değişiklikleri loglar ve state'i günceller
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    console.log('Updated Form Data:', updatedFormData); // Log ekleme
    setFormData(updatedFormData);
  };

  // Form gönderildiğinde işlemleri loglar ve API çağrısı yapar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Eksik alan kontrolü
    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      console.error('Validation Error: Missing email or password'); // Log ekleme
      return;
    }
    if (!isLogin && !formData.name) {
      setError('Full Name is required for registration.');
      console.error('Validation Error: Missing full name for registration'); // Log ekleme
      return;
    }

    try {
      let response;
      console.log('Submitting Form Data:', formData); // Log ekleme
      if (isLogin) {
        response = await login(formData.email, formData.password);
        console.log('Login Successful:', response); // Log ekleme
      } else {
        response = await register(formData.name, formData.email, formData.password);
        console.log('Registration Successful:', response); // Log ekleme
      }

      localStorage.setItem('token', response.token); // Token'ı sakla
      alert(isLogin ? 'Login Successful!' : 'Registration Successful!');
      setError('');
    } catch (err: any) {
      console.error('API Error:', err.response?.data || err.message); // Log ekleme
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  // Giriş ve kayıt modları arasında geçiş yapar
  const toggleMode = () => {
    setError('');
    setFormData({ name: '', email: '', password: '' });
    console.log('Mode Switched:', isLogin ? 'Register' : 'Login'); // Log ekleme
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isLogin ? 'Login' : 'Register'}
        </h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={toggleMode}
                className="text-indigo-600 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={toggleMode}
                className="text-indigo-600 hover:underline">
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
