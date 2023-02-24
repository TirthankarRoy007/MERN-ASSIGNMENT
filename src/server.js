const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false)
const cors = require('cors')

// Connect to MongoDB
mongoose.connect('mongodb+srv://Tirtha008:mlpnk3AhOzHztAdO@tirthacluster.psqixlb.mongodb.net/mern')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Define the employee schema
const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Define the employee model
const Employee = mongoose.model('Employee', employeeSchema);

// Create the express app
const app = express();
app.use(cors())

// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());

// Set up the login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find the employee with the given email
  Employee.findOne({ email }, (err, employee) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the password matches
    if (employee.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Set up the employee list route
app.get('/employees', (req, res) => {
  try {
    Employee.find({}, (err, employees) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      else{
      res.json(employees);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Start the server
app.listen(3001, () => console.log('Server started on port 3001'));