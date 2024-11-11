import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [showList, setShowList] = useState(false);
    const navigate = useNavigate();

    const handleCreateEmployee = () => {
        localStorage.clear();
        navigate('/create-employee');
    };

    const handleList = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employee/list');
            setEmployees(response.data);
            setShowList(true);
        } catch (error) {
            console.error("Error fetching employee list:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/employee/delete/${id}`);
            setEmployees((prevEmployees) => prevEmployees.filter(employee => employee._id !== id)); // Update state after deletion
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <Button variant="contained" onClick={handleCreateEmployee} sx={{ mt: 2 }}>
                Create Employee
            </Button>
            <Button variant="contained" onClick={handleList} sx={{ mt: 2, ml: 2 }}>
                Employee List
            </Button>

            {showList && (
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Typography variant="h6" sx={{ padding: 2 }}>Employee List</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Mobile</TableCell>
                                <TableCell>Designation</TableCell>
                                <TableCell>Gender</TableCell>
                                <TableCell>Course</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map((employee, index) => (
                                <TableRow key={employee._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{employee.f_Name}</TableCell>
                                    <TableCell>{employee.f_Email}</TableCell>
                                    <TableCell>{employee.f_Mobile}</TableCell>
                                    <TableCell>{employee.f_Designation}</TableCell>
                                    <TableCell>{employee.f_gender}</TableCell>
                                    <TableCell>{employee.f_Course.join(', ')}</TableCell>
                                    <TableCell>
                                        {employee.f_Image ? (
                                            <img
                                             src={`http://localhost:5000/${employee.f_Image.replace(/\\/g, '/')}`} // Correct path for the image
                                          // src={'http://localhost:5000/uploads/1731259854550.jpg'}
                                               
                                            alt={employee.f_Name}
                                                width="50"
                                                height="50"
                                            />
                                        ) : (
                                            'No Image'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton component={Link} to={`/edit-employee/${employee._id}`} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(employee._id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}

export default EmployeeList;
