import React, { useContext } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Avatar 
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import Layout from '../layouts/Layout';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <Layout>
        <Typography variant="h6">Please login to view your profile</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              sx={{ 
                width: 150, 
                height: 150, 
                bgcolor: 'primary.main',
                fontSize: '4rem'
              }}
            >
              <PersonIcon sx={{ fontSize: 80 }} />
            </Avatar>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {user.username}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    <strong>Email:</strong> {user.email}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Role:</strong> {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
};

export default Profile;
