const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');

const path = require('path');
const fs = require('fs');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// Constants
const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] } });

const PORT = process.env.PORT || 4000;
const JWT_SECRET = 'admin'; // Secret for JWT signing

// Middleware
app.use(bodyParser.json());
// app.use(cors()); // Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000'
  }));

app.use(express.json());


// When a client connects
io.on('connection', (socket) => {
  console.log('A user connected: ', socket.id);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected: ', socket.id);
  });
});

// Emit an event when a student is added or grade updated
function notifyUsers(event, data) {
  console.log(`Sending notification: ${event} - ${data.message}`);
  io.emit(event, data);  // Send notification to all connected users
}

// Example of student added notification
app.post('/addStudent', async (req, res) => {
  const { studentName, studentId } = req.body;
  // Add the student logic here
  
  // Notify all users
  notifyUsers('studentAdded', { message: `Student ${studentName} has been added.` });

  res.status(200).send('Student added and notification sent');
});

// Example of grade updated notification
app.post('/updateGrade', async (req, res) => {
  const { studentId, newGrade } = req.body;
  // Update grade logic here
  
  // Notify all users
  notifyUsers('gradeUpdated', { message: `Grade updated for student ${studentId} is ${newGrade}` });

  res.status(200).send('Grade updated and notification sent');
});


// Dummy data for simplicity
let students = [
    { id: '123', name: 'John Doe', grades: { Math: 'A', Science: 'B' } },
    { id: '456', name: 'Jane Smith', grades: { Math: 'B+', History: 'A' } }
  ];
  

  // Update student grade (HOD functionality)
  app.post('/grades/update', (req, res) => {
    const { id, course, grade } = req.body;
    const student = students.find(s => s.id === id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    student.grades[course] = grade;
    res.status(200).json(student);
  });
  
  // Query student record (Adviser and Student functionality)
  app.get('/students/query/:id', (req, res) => {
    const student = students.find(s => s.id === req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  });

  

// Load connection profile
const ccpPath = path.resolve(__dirname, 'fabric-network', 'connection.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));



// Helper function to get a contract
async function getContract() {
    // Load wallet
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
  
    // Set up gateway and connect
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: 'admin', // Use appropriate identity
      discovery: { enabled: true, asLocalhost: true }
    });
  
    // Get network and contract
    const network = await gateway.getNetwork('mychannel');
    return network.getContract('studentcc');
  }
  

    app.get('/', (req, res) => {
      res.send('Blockchain Student Record System Backend');

});

app.post('/students/add', async (req, res) => {
  try {
    const { id, name } = req.body;
    const contract = await getContract();
    await contract.submitTransaction('AddStudent', id, name);
    
    // Emit notification after the student is added
    notifyUsers('studentAdded', { message: `New student ${name} added via blockchain.` });
    
    res.status(200).send(`Student ${name} added successfully`);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});


  // Update grade API
  app.post('/grades/update', async (req, res) => {
    try {
      const { id, course, grade } = req.body;
      const contract = await getContract();
      await contract.submitTransaction('UpdateGrade', id, course, grade);
      res.status(200).send(`Grade updated for student ${id}`);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  });
  
  // Query student API
  app.get('/students/query/:id', async (req, res) => {
    try {
      const contract = await getContract();
      const result = await contract.evaluateTransaction('QueryStudent', req.params.id);
      res.status(200).json(JSON.parse(result.toString()));
    } catch (error) {
      res.status(500).send(error.toString());
    }
  });
  

  // Import routes for students and grades
const studentRoutes = require('./routes/students');
const gradeRoutes = require('./routes/grades');
const verifyToken = require('./middleware/auth');


// Dummy user database for authentication
const users = [
    { username: 'hod', password: bcrypt.hashSync('hod123', 8), role: 'admin' },
    { username: 'adviser', password: bcrypt.hashSync('adviser123', 8), role: 'admin' },
    { username: 'student1', password: bcrypt.hashSync('student123', 8), role: 'student' }
  ];
  
  // Login route
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
  
    if (!user) return res.status(404).json({ message: 'User not found' });
  
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'invalid Password' });
  
    const token = jwt.sign({ id: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ auth:true, token, role: user.role });
    // Set the token in a cookie or send it in the response
    res.cookie('token', token, { httpOnly: true });

});

  

app.use('/students', verifyToken, studentRoutes);
app.use('/grades', verifyToken, gradeRoutes);
app.use(cors({
  origin: 'http://localhost:3000'
}));
  
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });