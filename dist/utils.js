"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const del = require("del");
const loadCollection = function (colName, db) {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        });
    });
};
exports.loadCollection = loadCollection;
const txtFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(txt)$/)) {
        return cb(new Error('Only txt files are allowed!'), false);
    }
    cb(null, true);
};
exports.txtFilter = txtFilter;
const cleanFolder = function (folderPath) {
    // delete files inside folder but not the folder itself
    del.sync([`${folderPath}/**`, `!${folderPath}`]);
};
exports.cleanFolder = cleanFolder;
//# sourceMappingURL=utils.js.map