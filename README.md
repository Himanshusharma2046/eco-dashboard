# eCommerce Dashboard Application

A full-stack eCommerce dashboard application built with React, Node.js, Express, and MySQL.

## Features

- User authentication (login/register)
- Role-based access control (admin/user)
- Product management (CRUD operations)
- Product search and pagination
- CSV export functionality
- Responsive design with Material UI

## Tech Stack

### Frontend
- React
- Material UI
- Axios
- React Router
- AG Grid
- File-Saver

### Backend
- Node.js
- Express
- MySQL
- JWT Authentication
- Bcrypt.js

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL database
- npm or yarn

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/ecommerce-dashboard.git
cd ecommerce-dashboard/server
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_dashboard
JWT_SECRET=your_jwt_secret_key
```

4. Set up the database
```sql
CREATE DATABASE ecommerce_dashboard;
USE ecommerce_dashboard;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@example.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', 'admin');
```

5. Start the backend server
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory
```bash
cd ../client
```

2. Install dependencies
```bash
npm install
```

3. Start the frontend development server
```bash
npm start
```

## Deployment

### Frontend Deployment (Netlify)

1. Build the React application
```bash
cd client
npm run build
```

2. Deploy to Netlify using the Netlify UI:
   - Go to [Netlify](https://app.netlify.com/)
   - Sign up or log in
   - Drag and drop the `build` folder from your client directory to the Netlify dashboard
   - Wait for the deployment to complete

3. Configure Netlify for React Router:
   - Create a `_redirects` file in your `public` folder with the content:
   ```
   /*    /index.html   200
   ```
   - Rebuild and redeploy

### Backend Deployment (Render)

1. Create a new Web Service on Render:
   - Sign up or log in to [Render](https://render.com/)
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - Name: `ecommerce-dashboard-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `node server.js`
     - Select the appropriate plan

2. Set up environment variables:
   - In the Render dashboard, go to your web service
   - Click on "Environment" tab
   - Add all the variables from your `.env` file

3. Update the frontend API base URL:
   - In `client/src/services/api.js`, update the axios base URL to your Render service URL:
   ```javascript
   axios.defaults.baseURL = 'https://your-render-service-url.onrender.com/api';
   ```
   - Rebuild and redeploy the frontend

## Usage

### Admin Access
- Email: admin@example.com
- Password: admin123

### User Management
- Register new users through the registration page
- Admins can manage user roles

### Product Management
- View all products on the dashboard
- Add new products (admin only)
- Edit existing products (admin only)
- Delete products (admin only)
- Export product data to CSV

## Screenshots

![Login Screen](screenshots/login.png)
![Dashboard](screenshots/dashboard.png)
![Product Management](screenshots/products.png)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Material UI](https://mui.com/) for the UI components
- [AG Grid](https://www.ag-grid.com/) for the data grid
- [React Router](https://reactrouter.com/) for routing
- [Express](https://expressjs.com/) for the backend API
