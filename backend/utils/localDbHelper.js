const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const getFilePath = (collection) => path.join(dataDir, `${collection}.json`);

const readData = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error(`Error reading ${collection}.json:`, err);
    return [];
  }
};

const writeData = (collection, data) => {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${collection}.json:`, err);
    return false;
  }
};

module.exports = {
  readData,
  writeData,
  find: (collection, filter = {}) => {
    let list = readData(collection);
    return list.filter(item => {
      for (let key in filter) {
        if (filter[key] !== undefined && item[key] !== filter[key]) return false;
      }
      return true;
    });
  },
  findOne: (collection, filter = {}) => {
    let list = readData(collection);
    return list.find(item => {
      for (let key in filter) {
        if (filter[key] !== undefined && item[key] !== filter[key]) return false;
      }
      return true;
    }) || null;
  },
  findById: (collection, id) => {
    let list = readData(collection);
    return list.find(item => item._id === id || String(item._id) === String(id)) || null;
  },
  create: (collection, doc) => {
    let list = readData(collection);
    const newDoc = {
      _id: doc._id || Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    list.push(newDoc);
    writeData(collection, list);
    return newDoc;
  },
  findByIdAndUpdate: (collection, id, update) => {
    let list = readData(collection);
    let index = list.findIndex(item => item._id === id || String(item._id) === String(id));
    if (index === -1) return null;
    
    let updatedObj = { ...list[index] };
    
    // Support basic updating
    if (update.$push) {
      for (let key in update.$push) {
        if (!Array.isArray(updatedObj[key])) updatedObj[key] = [];
        updatedObj[key].push(update.$push[key]);
      }
    } else if (update.$pull) {
      for (let key in update.$pull) {
        if (Array.isArray(updatedObj[key])) {
          updatedObj[key] = updatedObj[key].filter(v => v !== update.$pull[key] && (v._id ? v._id !== update.$pull[key] : true));
        }
      }
    } else {
      updatedObj = { ...updatedObj, ...update };
    }
    
    updatedObj.updatedAt = new Date().toISOString();
    list[index] = updatedObj;
    writeData(collection, list);
    return updatedObj;
  },
  findByIdAndDelete: (collection, id) => {
    let list = readData(collection);
    let index = list.findIndex(item => item._id === id || String(item._id) === String(id));
    if (index === -1) return null;
    const deleted = list.splice(index, 1)[0];
    writeData(collection, list);
    return deleted;
  }
};
