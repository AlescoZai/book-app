const { getBukus, addBuku, getBukuById, updateBuku, deleteBuku } = require('./handler')

const routes = [
  { method: 'POST', path: '/books', handler: addBuku },
  { method: 'GET', path: '/books', handler: getBukus },
  { method: 'GET', path: '/books/{bookId}', handler: getBukuById },
  { method: 'PUT', path: '/books/{bookId}', handler: updateBuku },
  { method: 'DELETE', path: '/books/{bookId}', handler: deleteBuku }
]

module.exports = routes
