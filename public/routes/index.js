const express = require('express');
const router = express.Router();

// Home route
router.get('/', function(req, res) {
  res.render('index', { title: 'CSE Motors | Home' });
});

module.exports = router;