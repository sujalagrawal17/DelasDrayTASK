import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Button, 
    FormControl, 
    FormControlLabel, 
    FormLabel, 
    InputLabel, 
    MenuItem, 
    Paper, 
    Radio, 
    RadioGroup, 
    Checkbox, 
    Select, 
    TextField, 
    Typography 
} from '@mui/material';

function CreateEmployee() {
    const [formData, setFormData] = useState({
        f_Name: '',
        f_Email: '',
        f_Mobile: '',
        f_Designation: '',
        f_gender: '',
        f_Course: [] // Array to store selected courses
    });
    const [f_Image, setF_Image] = useState(null); // State for image file
    const [imageName, setImageName] = useState(''); // State for displaying image file name
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setF_Image(file);
        setImageName(file ? file.name : ''); // Update the imageName state with the file name
    };

    const handleCourseChange = (e) => {
        const { value } = e.target;
        setFormData(prevData => {
            const newCourses = prevData.f_Course.includes(value)
                ? prevData.f_Course.filter(course => course !== value) // Unselect if already selected
                : [...prevData.f_Course, value]; // Select if not already selected
            return { ...prevData, f_Course: newCourses };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!f_Image) {
            setError('Please select an image.');
            return;
        }

        try {
            const data = new FormData();
            data.append('f_Name', formData.f_Name);
            data.append('f_Email', formData.f_Email);
            data.append('f_Mobile', formData.f_Mobile);
            data.append('f_Designation', formData.f_Designation);
            data.append('f_gender', formData.f_gender);
            data.append('f_Image', f_Image);

            formData.f_Course.forEach(course => {
                data.append('f_Course[]', course);
            });

            await axios.post('http://localhost:5000/api/employee/create', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            navigate('/employees');
        } catch (error) {
            setError(error.response?.data?.errors?.[0]?.msg || 'Error creating employee');
        }
    };

    return (
        <Box display="flex" justifyContent="center" p={2}>
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 600 }}>
                <Typography variant="h4" align="center" gutterBottom>Create Employee</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="f_Name"
                        variant="outlined"
                        value={formData.f_Name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="f_Email"
                        type="email"
                        variant="outlined"
                        value={formData.f_Email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Mobile Number"
                        name="f_Mobile"
                        variant="outlined"
                        value={formData.f_Mobile}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Designation</InputLabel>
                        <Select
                            name="f_Designation"
                            value={formData.f_Designation}
                            onChange={handleChange}
                            label="Designation"
                        >
                            <MenuItem value="HR">HR</MenuItem>
                            <MenuItem value="Manager">Manager</MenuItem>
                            <MenuItem value="Sales">Sales</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup
                            row
                            name="f_gender"
                            value={formData.f_gender}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="Male" control={<Radio />} label="Male" />
                            <FormControlLabel value="Female" control={<Radio />} label="Female" />
                        </RadioGroup>
                    </FormControl>
                    
                    {/* Courses as checkboxes */}
                    <Typography variant="h6" gutterBottom>Courses</Typography>
                    {['MCA', 'BCA', 'BSC'].map((course) => (
                        <FormControlLabel
                            key={course}
                            control={
                                <Checkbox
                                    checked={formData.f_Course.includes(course)}
                                    onChange={handleCourseChange}
                                    value={course}
                                />
                            }
                            label={course}
                        />
                    ))}
                    
                    <Box margin="normal">
                        <Button variant="outlined" component="label">
                            Upload Image
                            <input
                                type="file"
                                name="f_Image"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                        {imageName && (
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                Selected File: {imageName}
                            </Typography>
                        )}
                    </Box>
                    {error && <Typography color="error" variant="body2">{error}</Typography>}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Submit
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}

export default CreateEmployee;
