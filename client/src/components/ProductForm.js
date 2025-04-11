import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress, 
  Alert,
  InputAdornment
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { productApi } from '../services/api';

// Validation schema
const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .max(1000, 'Too Long!'),
  price: Yup.number()
    .positive('Price must be positive')
    .required('Required'),
  image_url: Yup.string()
    .url('Must be a valid URL'),
  stock_quantity: Yup.number()
    .integer('Must be a whole number')
    .min(0, 'Cannot be negative')
    .required('Required')
});

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    stock_quantity: 0
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId) => {
    setLoading(true);
    try {
      const product = await productApi.getById(productId);
      setInitialValues({
        name: product.name,
        description: product.description || '',
        price: product.price,
        image_url: product.image_url || '',
        stock_quantity: product.stock_quantity
      });
    } catch (err) {
      setError('Failed to fetch product details. Please try again.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    setSubmitting(true);
    
    try {
      if (isEdit) {
        await productApi.update(id, values);
      } else {
        await productApi.create(values);
      }
      navigate('/products');
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} product. Please try again.`);
      console.error(`Error ${isEdit ? 'updating' : 'creating'} product:`, err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEdit ? 'Edit Product' : 'Create New Product'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Formik
        initialValues={initialValues}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  name="name"
                  label="Product Name"
                  variant="outlined"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  name="description"
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="price"
                  label="Price"
                  variant="outlined"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Field
                  as={TextField}
                  fullWidth
                  name="stock_quantity"
                  label="Stock Quantity"
                  variant="outlined"
                  type="number"
                  error={touched.stock_quantity && Boolean(errors.stock_quantity)}
                  helperText={touched.stock_quantity && errors.stock_quantity}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  fullWidth
                  name="image_url"
                  label="Image URL"
                  variant="outlined"
                  error={touched.image_url && Boolean(errors.image_url)}
                  helperText={touched.image_url && errors.image_url}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/products')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Create')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default ProductForm;
