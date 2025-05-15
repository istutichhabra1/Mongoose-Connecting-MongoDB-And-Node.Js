const express = require("express");
const router = express.Router();
const {
  addBook, borrowBook, returnBook, getBooks, deleteBook
} = require("../controllers/library.controller");

const {
  validateBookData, checkBorrowLimit
} = require("../middleware/library.middleware");

router.post("/books", validateBookData, addBook);
router.get("/books", getBooks);
router.patch("/borrow/:id", checkBorrowLimit, borrowBook);
router.patch("/return/:id", returnBook);
router.delete("/books/:id", deleteBook);

module.exports = router;
