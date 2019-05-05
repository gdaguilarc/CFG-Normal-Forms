"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const Loki = require("lokijs");
const utils_1 = require("./utils");
// setup
const DB_NAME = 'db.json';
const COLLECTION_NAME = 'files';
const UPLOAD_PATH = '../uploads';
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });
const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: utils_1.txtFilter }); // apply filter
utils_1.cleanFolder(UPLOAD_PATH);
// app
const app = express();
app.use(cors());
app.set('views', path.join(__dirname, '../src/views'));
app.use(express.static(path.join(__dirname, '../src/public')));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index');
});
app.post('/result', upload.single('cfg'), (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const col = yield utils_1.loadCollection(COLLECTION_NAME, db);
        console.log(req.file);
        const data = col.insert(req.file);
        db.saveDatabase();
        res.send({ id: data.$loki, fileName: data.filename, originalName: data.originalname });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}));
app.listen(3000, function () {
    console.log('listening on port 3000!');
});
//# sourceMappingURL=app.js.map