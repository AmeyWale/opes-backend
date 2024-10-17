var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/test",function name(params) {
  console.log("Test")
})

const studentRoutes = require('./students');
router.use('/students', studentRoutes);

module.exports = router;
