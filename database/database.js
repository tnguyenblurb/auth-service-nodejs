const fs = require('fs');

const save = (data, path) => {
  items = load(path) 

  try {
    fs.writeFileSync(path, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

const load = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = {save, load};