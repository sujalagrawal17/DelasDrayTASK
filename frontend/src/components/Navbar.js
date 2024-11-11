import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
export default function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('f_userName');
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
};
  return (
    <div>
         {/* Navbar */}
         <AppBar position="static" color="default">
                <Toolbar>
                    {/* Logo on the left */}
                    <Box display="flex" alignItems="center">
                        <img src='/Logo_TV_2015.png' alt="Logo" style={{ height: 40, marginRight: 16 }} />
                        <Button component={Link} to="/" color="inherit">Home</Button>
                        <Button component={Link} to="/employees" color="inherit">Employee List</Button>
                    </Box>

                    {/* Logout on the right */}
                    <Box ml="auto">
                    {userName && (
                        <Typography variant="body1" style={{ marginRight: 8 }}>
                            {userName}
                        </Typography>
                    )}
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </Box>
                </Toolbar>
            </AppBar>
    </div>
  )
}
