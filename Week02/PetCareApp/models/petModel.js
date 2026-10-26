const connection = require('../config/db');

function create(ownerId, name, species, breed, age, image, callback) {
  const sql = 'INSERT INTO pets (owner_id, name, species, breed, age, image) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(sql, [ownerId, name, species, breed, age, image], callback);
}

function findByOwnerId(ownerId, callback) {
  const sql = 'SELECT * FROM pets WHERE owner_id = ?';
  connection.query(sql, [ownerId], callback);
}

module.exports = { create, findByOwnerId };
