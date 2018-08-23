const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, data) => {
    fs.writeFile(path.join(exports.dataDir, `${data}.txt`), text, (err)=> {
      if (err) {
        throw ('error writing file');
      } else {
        callback(null, {id: data, text: text});
      }
    });
  });
};

exports.readOne = (id, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var foundFile = false;
      for (var i = 0; i < files.length; i++) {
        var currentId = files[i].slice(0, 5);
        if (currentId === id) {
          foundFile = true;
          fs.readFile(path.join(exports.dataDir, files[i]), 'utf8', (err, data) => {
            if (err) {
              callback(new Error(`No item with id: ${id}`));
            } else {
              callback(null, {id: currentId, text: data});
            }
          });
        }
      }
      if (!foundFile) {
        callback(new Error(`No item with id: ${id}`));
      }
    }
  });
};

exports.readAll = (callback) => {
  var data = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading files');
    } else {
      for (var i = 0; i < files.length; i++) {
        data.push({id: files[i].slice(0, 5), text: files[i].slice(0, 5)});
      }
      callback(null, data);
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var fileExists = false;
      for (var i = 0; i < files.length; i++) {
        if (files[i].slice(0, 5) === id) {
          fileExists = true;
          fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
            if (err) {
              callback(new Error(`No item with id: ${id}`));
            } else {
              callback(null, {id: id, text: text});
            }
          });
        }
      }
      if (!fileExists) {
        callback(new Error(`No item with id: ${id}`));
      }
    }
  })
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var fileExists = false;
      for (var i = 0; i < files.length; i++) {
        if (files[i].slice(0, 5) === id) {
          fileExists = true;
          fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
            if (err) {
              callback(new Error(`No item with id: ${id}`));
            } else {
              callback(null);
            }
          });
        }
      }
      if (!fileExists) {
        callback(new Error(`No item with id: ${id}`));
      }
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
