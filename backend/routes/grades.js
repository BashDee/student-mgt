const express = require('express');
const router = express.Router();
const { getContract } = require('../server');

// Update student grade
router.post('/update', async (req, res) => {
  const { id, course, grade } = req.body;
  try {
    const contract = await getContract();
    await contract.submitTransaction('UpdateGrade', id, course, grade);
    res.status(200).json({ message: 'Grade updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update grade' });
  }
});

module.exports = router;
