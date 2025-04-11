const config = {
    apiUrl: process.env.NODE_ENV === 'production'
      ? 'https://eco-dashboard.onrender.com'
      : 'http://localhost:5000/api'
  };
  
  export default config;
  