const path = require('path');
const fs = require('fs');
const db_path = path.join(__dirname, 'db.json');
const save = (data, table) => {
  let db = loadDatabase();
  if (!(table in db)) {
    db[table] = [];
  }
  
  db[table].push(data);

  try {
    fs.writeFileSync(db_path, JSON.stringify(db));
    return data;
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