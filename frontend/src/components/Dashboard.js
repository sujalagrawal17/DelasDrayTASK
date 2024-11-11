import React from 'react';

import { Typography, Container } from '@mui/material';
import Navbar from './Navbar';
 // Update the path to your logo

function Dashboard() {

    const username = localStorage.getItem('username');



    return (
        <div>
           <Navbar/>

            {/* Centered Heading */}
            <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome Admin Panel
                </Typography>
                <Typography variant="h5">
                    Welcome, {username}!
                </Typography>
            </Container>
        </div>
    );
}

export default Dashboard;
