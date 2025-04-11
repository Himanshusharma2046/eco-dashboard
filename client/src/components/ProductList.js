import { saveAs } from 'file-saver';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  InputAdornment, 
  IconButton,
  Paper,
  Pagination,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon,
  FileDownload as FileDownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    total: 0
  });
  
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await productApi.getAll(
        pagination.page, 
        pagination.limit, 
        search
      );
      
      setProducts(data.products);
      setPagination(prev => ({
        ...prev,
        totalPages: data.pagination.totalPages,
        total: data.pagination.total
      }));
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }));
  };
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on new search
    fetchProducts();
  };
  
  const handleExport = async () => {
    try {
      setLoading(true);
      // Get all products for export (no pagination)
      const { products } = await productApi.getAll(1, 1000);
      
      if (!products || products.length === 0) {
        setError('No products to export');
        return;
      }
      
      // Convert products to CSV format
      const headers = ['ID', 'Name', 'Description', 'Price', 'Stock Quantity', 'Image URL'];
      const csvData = [
        headers.join(','), // Header row
        ...products.map(product => [
          product.id,
          `"${product.name.replace(/"/g, '""')}"`, // Escape quotes in CSV
          `"${(product.description || '').replace(/"/g, '""')}"`,
          product.price,
          product.stock_quantity,
          `"${product.image_url || ''}"`
        ].join(','))
      ].join('\n');
      
      // Create a Blob and download the file
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `products-export-${new Date().toISOString().slice(0, 10)}.csv`);
      
      setError('');
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export products. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddProduct = () => {
    navigate('/products/create');
  };
  
  const handleEditProduct = (id) => {
    navigate(`/products/edit/${id}`);
  };
  
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.delete(id);
        fetchProducts(); // Refresh the list
      } catch (err) {
        setError('Failed to delete product. Please try again.');
      }
    }
  };
  
  // AG Grid column definitions
  const columnDefs = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      sortable: true,
      filter: true
    },
    {
      field: 'image_url',
      headerName: 'Image',
      width: 120,
      cellRenderer: params => {
        return params.value ? (
          <img 
            src={params.value} 
            alt={params.data.name} 
            style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            No Image
            </div>
        );
      }
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1,
      sortable: true,
      filter: true
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      sortable: true,
      filter: true,
      valueFormatter: params => `$${parseFloat(params.value).toFixed(2)}`
    },
    {
      field: 'stock_quantity',
      headerName: 'Stock',
      width: 100,
      sortable: true,
      filter: true
    },
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: params => {
        return isAdmin() ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton 
                size="small" 
                color="primary" 
                onClick={() => handleEditProduct(params.data.id)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => handleDeleteProduct(params.data.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : null;
      }
    }
  ];

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Products
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isAdmin() && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
          )}
          
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Box>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div className="ag-theme-material" style={{ height: 500, width: '100%' }}>
            <AgGridReact
              rowData={products}
              columnDefs={columnDefs}
              pagination={false}
              rowSelection="single"
              animateRows={true}
              domLayout="autoHeight"
            />
          </div>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ProductList;
