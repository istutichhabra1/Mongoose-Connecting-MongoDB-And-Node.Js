const Library = require("../models/library.model");

// Validate required fields
const validateBookData = (req, res, next) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: "Incomplete Data" });
  }
  next();
};

// Borrowing limit middleware
const checkBorrowLimit = async (req, res, next) => {
  const borrowerName = req.body.borrowerName;
  const borrowedBooks = await Library.countDocuments({
    borrowerName,
    status: "borrowed"
  });
  if (borrowedBooks >= 3) {
    return res.status(409).json({ message: "Borrowing limit exceeded" });
  }
  next();
};

module.exports = { validateBookData, checkBorrowLimit };
