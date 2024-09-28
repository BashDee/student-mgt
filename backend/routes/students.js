const express = require('express');
const router = express.Router();
const { getContract } = require('../server');

// Add a student
router.post('/add', async (req, res) => {
  const { id, name } = req.body;
  try {
    const contract = await getContract();
    await contract.submitTransaction('AddStudent', id, name);
    res.status(200).json({ message: 'Student added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// Query student record
router.get('/query/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await getContract();
    const result = await contract.evaluateTransaction('QueryStudent', id);
    res.status(200).json(JSON.parse(result.toString()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student record' });
  }
});

module.exports = router;
