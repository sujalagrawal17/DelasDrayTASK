import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CircularProgress,
    Typography,
} from '@mui/material';

function EditEmployee() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        f_Name: '',
        f_Email: '',
        f_Mobile: '',
        f_Designation: '',
        f_gender: '',
        f_Course: [],
        f_Image: '', 
    });
    const [imageFile, setImageFile] = useState(null); // State to hold the selected image file
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch employee data when component mounts
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/employee/${id}`);
                setFormData(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching employee data');
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'f_Course') {
            setFormData(prevState => {
                const newCourses = checked
                    ? [...prevState.f_Course, value]
                    : prevState.f_Course.filter(course => course !== value);
                return { ...prevState, f_Course: newCourses };
            });
        } else if (name === 'f_Image') {
            setImageFile(e.target.files[0]); // Set the selected image file
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = new FormData();
        updatedData.append('f_Name', formData.f_Name);
        updatedData.append('f_Email', formData.f_Email);
        updatedData.append('f_Mobile', formData.f_Mobile);
        updatedData.append('f_Designation', formData.f_Designation);
        updatedData.append('f_gender', formData.f_gender);
        formData.f_Course.forEach(course => updatedData.append('f_Course', course));

        if (imageFile) {
            updatedData.append('f_Image', imageFile); // Append the file to FormData
        } else {
            updatedData.append('f_Image', formData.f_Image); // Append existing image path if no new file
        }

        try {
            await axios.put(`http://localhost:5000/api/employee/edit/${id}`, updatedData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/employees');
        } catch (error) {
            setError(error.response ? error.response.data.errors[0].msg : 'Error updating employee');
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>Edit Employee</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="f_Name"
                    variant="outlined"
                    fullWidth
                    value={formData.f_Name}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    label="Email"
                    name="f_Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={formData.f_Email}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    label="Mobile"
                    name="f_Mobile"
                    variant="outlined"
                    fullWidth
                    value={formData.f_Mobile}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <FormControl fullWidth variant="outlined" margin="normal" required>
                    <InputLabel>Designation</InputLabel>
                    <Select
                        name="f_Designation"
                        value={formData.f_Designation}
                        onChange={handleChange}
                    >
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Manager">Manager</MenuItem>
                        <MenuItem value="Sales">Sales</MenuItem>
                    </Select>
                </FormControl>
                <FormControl component="fieldset" margin="normal">
                    <Typography variant="h6" gutterBottom>Gender</Typography>
                    <FormControlLabel
                        control={<Checkbox checked={formData.f_gender === 'Male'} onChange={handleChange} value="Male" name="f_gender" />}
                        label="Male"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={formData.f_gender === 'Female'} onChange={handleChange} value="Female" name="f_gender" />}
                        label="Female"
                    />
                </FormControl>

                {/* Courses as checkboxes */}
                <Typography variant="h6" gutterBottom>Courses</Typography>
                {['MCA', 'BCA', 'BSC'].map((course) => (
                    <FormControlLabel
                        key={course}
                        control={
                            <Checkbox
                                checked={formData.f_Course.includes(course)}
                                onChange={handleChange}
                                value={course}
                                name="f_Course"
                            />
                        }
                        label={course}
                    />
                ))}

                <input
                    type="file"
                    name="f_Image"
                    onChange={handleChange}
                    accept="image/*"
                />

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '20px' }}>
                    Update Employee
                </Button>
                {error && <Typography color="error">{error}</Typography>}
            </form>
        </div>
    );
}

export default EditEmployee;
