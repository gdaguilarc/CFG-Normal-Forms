import * as del from 'del';
import * as Loki from 'lokijs';

const loadCollection = function(colName, db: Loki): Promise<Collection<any>> {
  return new Promise(resolve => {
    db.loadDatabase({}, () => {
      const _collection = db.getCollection(colName) || db.addCollection(colName);
      resolve(_collection);
    });
  });
};

const txtFilter = function(req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(txt)$/)) {
    return cb(new Error('Only txt files are allowed!'), false);
  }
  cb(null, true);
};

const cleanFolder = function(folderPath) {
  // delete files inside folder but not the folder itself
  del.sync([`${folderPath}/**`, `!${folderPath}`]);
};

export { txtFilter, loadCollection, cleanFolder };
