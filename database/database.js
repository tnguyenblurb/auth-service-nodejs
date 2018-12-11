const mongoose = require('mongoose');

async function setup() {
  await mongoose.connect(process.env.db_dev, {
    autoReconnect: true,
    reconnectTries: 1000000,
    reconnectInterval: 3000
  });

  setupSchemas();

}
setup().catch(error => console.error(error.stack));

function setupSchemas() {

}

mongoose.Promise = Promise;

mongoose.connection.on('connected', () => {
  console.log('Connection Established')
});

mongoose.connection.on('reconnected', () => {
  console.log('Connection Reestablished')
});

mongoose.connection.on('disconnected', () => {
  console.log('Connection Disconnected')
});

mongoose.connection.on('close', () => {
  console.log('Connection Closed')
});

mongoose.connection.on('error', (error) => {
  console.log('ERROR: ' + error)
});


const path = require('path');
const fs = require('fs');
const uuidv1 = require('uuid/v1');
const db_path = path.join(__dirname, 'db.json');


// const User = {
//   id: null,
//   name: null,
//   email: null,
//   password: null,
//   role: 'user',
//   activate_code: null,
//   tokens: [],
//   created_at: null,
//   last_login_at: null,
// };

// const Token = {
//   uuid: null,
//   expired_at: null,
//   api_key: null
// };

const save = (obj, key) => {
  let db = loadDatabase();
  if (!(key in db)) {
    db[key] = [];
  }
  
  console.log(`database.save ${JSON.stringify(obj)}`);
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