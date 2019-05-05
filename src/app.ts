import * as express from 'express';
import * as multer from 'multer';
import * as cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import * as Loki from 'lokijs';
import { loadCollection, txtFilter, cleanFolder } from './utils';
import { CFG } from './cfg';

// setup
const DB_NAME = 'db.json';
const COLLECTION_NAME = 'files';
const UPLOAD_PATH = 'uploads';
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });
const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: txtFilter }); // apply filter
cleanFolder(UPLOAD_PATH);

// app
const app = express();
app.use(cors());

app.set('views', path.join(__dirname, '../src/views'));
app.use(express.static(path.join(__dirname, '../src/public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/result', upload.single('cfg'), async (req, res) => {
  try {
    const col = await loadCollection(COLLECTION_NAME, db);
    const data = col.insert(req.file);

    db.saveDatabase();
    const textByLine = fs
      .readFileSync(data.path)
      .toString()
      .split('\r\n');

    console.log(textByLine);

    const cfg = new CFG(textByLine);

    console.log('read', cfg);
    cfg.chomsky();
    res.send({ id: data.$loki, fileName: data.filename, originalName: data.originalname });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

app.listen(3000, function() {
  console.log('listening on port 3000!');
});
