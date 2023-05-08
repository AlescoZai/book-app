/* eslint-disable brace-style */
const books = require('./books')
const { nanoid } = require('nanoid')

const addBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage
  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt }

  // Logic tambah buku tanpa menggunakan nama
  if (newBook.name === undefined || newBook.name.toString().trim().length === 0) {
    const resp = h.response({ status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku' })
    resp.code(400)
    return resp
  }

  // logic tambah ketika readPage lebih besar daripada pageCount
  else if (parseInt(newBook.readPage.toString()) > parseInt(newBook.pageCount.toString())) {
    const resp = h.response({ status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' })
    resp.code(400)
    return resp
  }

  // logic tambah baca buku dengan kondisi selesai membaca
  else if (newBook.reading === true && parseInt(newBook.readPage.toString()) === parseInt(newBook.pageCount.toString())) {
    books.push(newBook)
    const resp = h.response({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: id } })
    resp.code(201)
    return resp
  }

  // logic tambah baca buku dengan kondisi belum selesai membaca
  else if (newBook.reading === true && parseInt(newBook.readPage.toString()) >= 0 && parseInt(newBook.readPage.toString()) < parseInt(newBook.pageCount.toString())) {
    books.push(newBook)
    const resp = h.response({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: id } })
    resp.code(201)
    return resp
  }

  // logic tambah buku yang belum terbaca and belum selesai yang mengandung dicoding
  else if (newBook.reading === false && parseInt(newBook.readPage.toString()) >= 0 && parseInt(newBook.readPage.toString()) < parseInt(newBook.pageCount.toString())) {
    const nameArr = newBook.name.toLowerCase().split(' ')
    const publisherArr = newBook.publisher.toLowerCase().split(' ')
    const summaryArr = newBook.summary.toLowerCase().split(' ')
    const authorArr = newBook.author.toLowerCase().split(' ')
    if (nameArr.length === 1 || publisherArr.length === 1 || summaryArr.length === 1 || authorArr.length === 1) {
      if (nameArr.indexOf('dicoding') === 0 || publisherArr.indexOf('dicoding') === 0 || summaryArr.indexOf('dicoding') === 0 || authorArr.indexOf('dicoding') === 0) {
        books.push(newBook)
        const resp = h.response({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: id } })
        resp.code(201)
        return resp
      }
    }
  }

  // logic tambah buku yang belum terbaca dengan kondisi belum selesai dibaca
  else if (newBook.reading === false && parseInt(newBook.readPage.toString()) >= 0 && parseInt(newBook.readPage.toString()) < parseInt(newBook.pageCount.toString())) {
    books.push(newBook)
    const resp = h.response({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: id } })
    resp.code(201)
    return resp
  }

  // Logic tambah buku dengan semua parameter
  books.push(newBook)
  const resp = h.response({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: id } })
  resp.code(201)
  return resp
}

const getBooks = (request, h) => {
  const booksIsAny = books.length
  const { reading } = request.query
  const { finished } = request.query
  const { name } = request.query

  // Logic mendapatkan data semua buku
  if (booksIsAny > 0) {
    const bookList = []
    for (let i = 0; i < booksIsAny; i++) {
      const keyBook = { id: books[i].id, name: books[i].name, publisher: books[i].publisher }
      bookList.push(keyBook)
    }
    // semua buku dengan parameter query terbaca 1
    if (reading === '1') {
      const readingBooks = []
      for (let i = 0; i < bookList.length; i++) {
        if (books[i].reading === true && books[i].readPage > 0 && books[i].readPage <= books[i].pageCount) {
          readingBooks.push(bookList[i])
        }
      }
      const resp = h.response({ status: 'success', data: { books: readingBooks } })
      resp.code(200)
      return resp
    }
    // semua buku dengan parameter query terbaca 0
    else if (reading === '0') {
      const unReadingBooks = []
      for (let i = 0; i < bookList.length; i++) {
        if (books[i].reading === false && books[i].readPage === 0) {
          unReadingBooks.push(bookList[i])
        }
      }
      const resp = h.response({ status: 'success', data: { books: unReadingBooks } })
      resp.code(200)
      return resp
    }
    // semua buku dengan parameter query selesai 1
    else if (finished === '1') {
      const finishedBooks = []
      for (let i = 0; i < bookList.length; i++) {
        if (books[i].finished === true) {
          finishedBooks.push(bookList[i])
        }
      }
      const resp = h.response({ status: 'success', data: { books: finishedBooks } })
      resp.code(200)
      return resp
    }
    // semua buku dengan parameter query selesai 0
    else if (finished === '0') {
      const unFinishedBooks = []
      for (let i = 0; i < bookList.length; i++) {
        if (books[i].finished === false && books[i].readPage >= 0 && books[i].readPage < books[i].pageCount) {
          unFinishedBooks.push(bookList[i])
        }
      }
      const resp = h.response({ status: 'success', data: { books: unFinishedBooks } })
      resp.code(200)
      return resp
    }
    // semua buku dengan parameter query yang mengandung dicoding
    else if (name === 'Dicoding') {
      const booksContainName = []
      for (let i = 0; i < booksIsAny; i++) {
        const nameBook = books[i].name.toLowerCase()
        const authorBook = books[i].author.toLowerCase()
        const summaryBook = books[i].summary.toLowerCase()
        const publisherBook = books[i].publisher.toLowerCase()

        const indexName = nameBook.split(' ').indexOf('dicoding')
        const indexAuthor = authorBook.split(' ').indexOf('dicoding')
        const indexSummary = summaryBook.split(' ').indexOf('dicoding')
        const indexPublisher = publisherBook.split(' ').indexOf('dicoding')

        if (nameBook.split(' ').length === 1 || authorBook.split(' ').length === 1 || summaryBook.split(' ').length === 1 || publisherBook.split(' ').length === 1) {
          if (indexName !== -1 || indexAuthor !== -1 || indexSummary !== -1 || indexPublisher !== -1) {
            booksContainName.push(bookList[i])
          }
        }
      }
      const resp = h.response({ status: 'success', data: { books: booksContainName } })
      resp.code(200)
      return resp
    }
    // semua buku
    else {
      const resp = h.response({ status: 'success', data: { books: bookList } })
      resp.code(200)
      return resp
    }
  }
  // Logic dapatkan data semua buku tetapi dengan kondisi tidak mengandung dicoding
  else {
    const resp = h.response({ status: 'success', data: { books: [] } })
    resp.code(200)
    return resp
  }
}

const getBookById = (request, h) => {
  const { bookId } = request.params
  const book = books.filter((book) => book.id === bookId)[0]

  // Logic jika id ditemukan
  if (book) {
    // readPage sama dengan pageCount
    if (parseInt(book.pageCount.toString()) === parseInt(book.readPage.toString())) {
      // If book any
      if (book) {
        const resp = h.response({ status: 'success', data: { book } })
        resp.code(200)
        return resp
      }
      // jika tidak ditemukan
      else {
        const resp = h.response({ status: 'fail', message: 'Buku tidak ditemukan' })
        resp.code(404)
        return resp
      }
    }
    // readPage tidak sama dengan pageCount
    else {
      const resp = h.response({ status: 'success', data: { book } })
      resp.code(200)
      return resp
    }
  }
  // Logic jika id tidak ditemukan
  else {
    const resp = h.response({ status: 'fail', message: 'Buku tidak ditemukan' })
    resp.code(404)
    return resp
  }
}

const updateBook = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === bookId)

  // Logic jika id ditemukan
  if (index !== -1) {
    // tanpa nama atau isian nama hanya spasi
    if (name === undefined || name.toString().trim().length === 0) {
      const resp = h.response({ status: 'fail', message: 'Gagal memperbarui buku. Mohon isi nama buku' })
      resp.code(400)
      return resp
    }
    // readPage lebih besar dari pageCount
    else if (parseInt(readPage.toString()) > parseInt(pageCount.toString())) {
      const resp = h.response({ status: 'fail', message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount' })
      resp.code(400)
      return resp
    }
    // readPage sama dengan pageCount
    else if (readPage === pageCount) {
      const finished = true
      books[index] = { ...books[index], name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt }
      const resp = h.response({ status: 'success', message: 'Buku berhasil diperbarui' })
      resp.code(200)
      return resp
    }
    // semua kondisi sesuai ketika id ditemukan
    else {
      books[index] = { ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt }
      const resp = h.response({ status: 'success', message: 'Buku berhasil diperbarui' })
      resp.code(200)
      return resp
    }
  }
  // Logic jika id tidak ditemukan
  else {
    const resp = h.response({ status: 'fail', message: 'Gagal memperbarui buku. Id tidak ditemukan' })
    resp.code(404)
    return resp
  }
}

const deleteBook = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)

  // Logic jika id ditemukan
  if (index !== -1) {
    books.splice(index, 1)
    const resp = h.response({ status: 'success', message: 'Buku berhasil dihapus' })
    resp.code(200)
    return resp
  }
  // Lgic jika id tidak ditemukan
  else {
    const resp = h.response({ status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan' })
    resp.code(404)
    return resp
  }
}

module.exports = { getBooks, addBook, getBookById, updateBook, deleteBook }
