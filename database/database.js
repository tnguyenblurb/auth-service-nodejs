const path = require('path');
const fs = require('fs');
const uuidv1 = require('uuid/v1');
const db_path = path.join(__dirname, 'db.json');
const save = (obj, key) => {
  let db = loadDatabase();
  if (!(key in db)) {
    db[key] = [];
  }
  
  if (!obj.id) {
    obj.id = uuidv1();
    db[key].push(obj);
  } else {
    index = db[key].findIndex(row => row.id === obj.id);
    index < 0 ? db[key].push(obj) : db[key][index] = obj;
  }

  try {
    fs.writeFileSync(db_path, JSON.stringify(db));
    return obj;
  } catch (err) {
    console.error(err);
    return false;
  }
}

const loadDatabase = () => {
  if (!fs.existsSync(db_path)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(db_path, 'utf8')) || {};
  } catch (err) {
    console.error(err);
    return {};
  }
}

const loadTable = (table) => {
  let db = loadDatabase();
  return db[table] || [];
}

module.exports = {save, loadTable};