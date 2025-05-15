const Library = require("../models/library.model");

// Add book
const addBook = async (req, res) => {
  try {
    const newBook = await Library.create({ ...req.body, status: "available" });
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Borrow book
const borrowBook = async (req, res) => {
  try {
    const book = await Library.findById(req.params.id);
    if (!book || book.status !== "available") {
      return res.status(404).json({ message: "Book not available" });
    }
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14);

    book.status = "borrowed";
    book.borrowerName = req.body.borrowerName;
    book.borrowDate = borrowDate;
    book.dueDate = dueDate;

    await book.save();
    res.status(200).json(book);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Return book
const returnBook = async (req, res) => {
  try {
    const book = await Library.findById(req.params.id);
    if (!book || book.status !== "borrowed") {
      return res.status(404).json({ message: "Book not borrowed" });
    }

    const returnDate = new Date();
    let overdueFees = 0;
    if (returnDate > book.dueDate) {
      const diffDays = Math.ceil((returnDate - book.dueDate) / (1000 * 60 * 60 * 24));
      overdueFees = diffDays * 10;
    }

    book.status = "available";
    book.returnDate = returnDate;
    book.overdueFees = overdueFees;
    await book.save();

    res.status(200).json(book);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all books
const getBooks = async (req, res) => {
  try {
    const { status, title } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (title) filter.title = new RegExp(title, "i");
    const books = await Library.find(filter);
    res.status(200).json(books);
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const book = await Library.findById(req.params.id);
    if (!book || book.status === "borrowed") {
      return res.status(409).json({ message: "Book cannot be deleted" });
    }
    await Library.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted" });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addBook, borrowBook, returnBook, getBooks, deleteBook };
