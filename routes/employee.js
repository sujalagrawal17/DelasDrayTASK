const express = require('express');
const path = require('path'); // Add path module
const Employee = require('../models/Employee');
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const router = express.Router();

// Middleware to serve static files from 'uploads' folder
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Route to create a new employee with image upload and validation
router.post('/create',
    upload.single('f_Image'), // Middleware to handle single image upload
    [
        body('f_Name').notEmpty().withMessage('Name is required'),
        body('f_Email')
            .isEmail().withMessage('Valid email is required')
            .bail()
            .custom(async (value) => {
                const existingEmployee = await Employee.findOne({ f_Email: value });
                if (existingEmployee) {
                    throw new Error('Email already in use');
                }
            }),
        body('f_Mobile').isNumeric().withMessage('Mobile number should be numeric')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const employeeData = {
            ...req.body,
            f_Image: req.file ? req.file.path.replace(/\\/g, '/') : ''  // Normalize the file path with forward slashes
        };

        try {
            const employee = new Employee(employeeData);
            await employee.save();
            res.status(201).json({ message: 'Employee created successfully', employee });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Route to list all employees
router.get('/list', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to update an employee by ID, including image upload
router.put('/edit/:id', upload.single('f_Image'), async (req, res) => {
    const updateData = {
        ...req.body,
        f_Image: req.file ? req.file.path.replace(/\\/g, '/') : req.body.f_Image // Normalize path if new image is uploaded
    };

    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee updated successfully', employee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to delete an employee by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
