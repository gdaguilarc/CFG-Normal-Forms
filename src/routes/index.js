import express from 'express';
import multer from 'multer';

const upload = multer({ dest: './uploads/' });
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/', upload.single('glc'), (req, res) => {
  console.log(req.file);
});

export default router;
