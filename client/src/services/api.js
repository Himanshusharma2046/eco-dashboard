import axios from 'axios';
import config from '../config';
axios.defaults.baseURL = config.apiUrl;
// Auth API
export const authApi = {
    login: async (email, password) => {
      try {
        const response = await axios.post('/api/auth/login', { email, password });
        return response.data;
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },
    
    register: async (userData) => {
      try {
        const response = await axios.post('/api/auth/register', userData);
        return response.data;
      } catch (error) {
        console.error('Error registering:', error);
        throw error;
      }
    },
    
    getCurrentUser: async () => {
      try {
        console.log('Making request to /api/auth/me');
        const response = await axios.get('/api/auth/me');
        console.log('Response from /api/auth/me:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error getting current user:', error);
        throw error;
      }
    }
  };
  
// Product API
export const productApi = {
  getAll: async (page = 1, limit = 10, search = '') => {
    try {
      const response = await axios.get(`/api/products?page=${page}&limit=${limit}&search=${search}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
  
  create: async (productData) => {
    try {
      const response = await axios.post('/api/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  update: async (id, productData) => {
    try {
      const response = await axios.put(`/api/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await axios.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
  
  exportToCSV: async () => {
    try {
      const response = await axios.get('/api/products/export', {
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting products:', error);
      throw error;
    }
  }
};
