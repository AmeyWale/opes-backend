import express from "express";
import studentRoutes from './students.js';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get("/test",function name(params) {
  console.log("Test")
})

router.use('/students', studentRoutes);

export default router;
