/**
 * Array containing all books in
 * library
 */
let myLibrary = [];

/**
 * Calls necessary functions on webpage load
 */
function main() {
  renderTable();
  addEventListeners();
}

class Book {
  /**
   * Creates a book object
   *
   * @param {string} title - Title of the book
   * @param {string} author - Author the book
   * @param {number} pages - Number of pages in the book
   * @param {Boolean} status - If the book has been read or not
   */
  constructor(title, author, pages, status) {
    this.title = title.trim(); //Remove whitespace from string values
    this.author = author.trim();
    this.pages = pages;
    this.status = status;
  }

  /**
   * Creates a row containing all of an object's
   * attributes along with buttons to manipulate
   * the object.
   *
   * @returns a row node representing the object
   */
  createRow = () => {
    const newRow = document.createElement("tr");
    //Buttons to change status and delete book
    const statusButton = document.createElement("button");
    const removeButton = document.createElement("button");

    //All of the cells within the row
    newRow.appendChild(
      document.createElement("td")
    ).innerText = `${this.title}`;
    newRow.appendChild(
      document.createElement("td")
    ).innerText = `${this.author}`;
    newRow.appendChild(
      document.createElement("td")
    ).innerText = `${this.pages}`;
    //Buttons to change status and remove book from library
    newRow.appendChild(document.createElement("td")).appendChild(statusButton);
    newRow.appendChild(document.createElement("td")).appendChild(removeButton);

    //Button classes
    statusButton.classList.add("status-button");
    removeButton.classList.add("remove-button");

    //Sets inner text of status button based on status
    statusButton.innerText = `${this.status ? "Read" : "Not Read"}`;
    removeButton.innerText = "Remove";
    //Sets background color based on status
    statusButton.style.backgroundColor = `${
      this.status ? "var(--table-button-green)" : "var(--table-button-red)"
    }`;

    //Add event listeners to buttons
    statusButton.addEventListener("click", changeStatus);
    removeButton.addEventListener("click", removeBook);

    //Gives row a 'data-book-number' attribute with a value of the objects index in the array
    myLibrary.forEach((book, index) => {
      if (this === book) {
        newRow.setAttribute("data-book-number", `${index}`);
      }
    });

    return newRow;
  };
}

/**
 * Callback function
 *
 * Adds book to library array and
 * table
 *
 */
function addBookToLibrary() {
  //Form control values
  const title = document.querySelector("#title");
  const author = document.querySelector("#author");
  const pages = document.querySelector("#pages");
  const status = document.querySelector("#book-status");

  //Check if form fields are valid before continuing
  if (
    checkFieldMissing(title) ||
    checkFieldMissing(author) ||
    checkFieldMissing(pages) ||
    checkPageUnderFlow(pages)
  ) {
    return;
  }

  const bookTable = document.querySelector("table");

  //Adds new book to library array
  let newBook = new Book(
    title.value,
    author.value,
    pages.value,
    status.checked
  );
  myLibrary.unshift(newBook);

  //Creates a new row for the book and render table
  bookTable.appendChild(newBook.createRow());
  renderTable();

  fadeOutModal();
}

/**
 * Displays table, called on webpage load and
 * whenever a book is added or removed from the
 * library to update the row's 'data-book-number' attribute
 * with the object's current index.
 */
function renderTable() {
  const tableHeader = document.querySelector("thead"); //Get the header of the table
  const bookTable = document.querySelector("table");

  //Remove children from table except for header
  bookTable.replaceChildren(tableHeader);

  //Add rows to table
  myLibrary.forEach((book) => {
    bookTable.appendChild(book.createRow());
  });

  //Only display table if library isn't empty
  if (myLibrary.length == 0) {
    bookTable.style.display = "none";
  } else {
    bookTable.style.display = "block";
  }
}

/**
 * Callback function
 *
 * Removes book from library
 */
function removeBook() {
  //Get the grandparent of the remove button, the <tr> element
  const row = this.parentNode.parentNode;

  myLibrary.forEach((book, index) => {
    if (row.getAttribute("data-book-number") == index) {
      myLibrary.splice(index, 1);
    }
  });

  renderTable();
}

/**
 * Callback function
 *
 * Changes the status of a book
 */
function changeStatus() {
  //Get the grandparent of the status button, the row element
  const row = this.parentNode.parentNode;
  let book = myLibrary[row.getAttribute("data-book-number")];

  book.status = !book.status; //change status to opposite of current status
  this.innerText = `${book.status ? "Read" : "Not Read"}`; //change button' inner text
  //Changes background color of button depending on status
  this.style.backgroundColor = `${
    book.status ? "var(--table-button-green)" : "var(--table-button-red)"
  }`;
}

/**
 * Adds event listeners to modal form, add book
 * button and window
 */
function addEventListeners() {
  const modal = document.querySelector(".modal");
  const modalCloseButton = document.querySelector(".modal-form > span");
  const addBookButton = document.querySelector(".add-book-button button");
  const addFormButton = document.querySelector(".modal-form button");

  addBookButton.addEventListener("click", fadeInModal);
  modalCloseButton.addEventListener("click", fadeOutModal);
  addFormButton.addEventListener("click", addBookToLibrary);

  //Animate book gif when user hovers
  addBookButton.addEventListener("mouseover", animateBookImage);
  addBookButton.addEventListener("mouseout", animateBookImage);

  window.addEventListener("mousedown", (e) => {
    //If the modal is currently active disable it if user clicks outside of its form
    if (e.target === modal) {
      fadeOutModal();
    }
  });

  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const pages = document.getElementById("pages");

  /**
   * Have field elements check for validity on
   * input
   */

  title.oninput = () => {
    checkFieldMissing(title);
  };

  author.oninput = () => {
    checkFieldMissing(author);
  };

  pages.oninput = () => {
    checkFieldMissing(pages);
    checkPageUnderFlow(pages);
  };
}

/**
 * Fade modal into view
 */
function fadeInModal() {
  const modal = document.querySelector(".modal");

  modal.style.animation = "fadeIn .5s";
  modal.style.display = "block";
}

/**
 * Fade out modal and reset modal form
 */
function fadeOutModal() {
  const modal = document.querySelector(".modal");
  const title = document.querySelector("#title");
  const author = document.querySelector("#author");
  const pages = document.querySelector("#pages");
  const status = document.querySelector("#book-status");

  modal.style.animation = "fadeOut .5s";

  //Reset modal form after it fades out
  setTimeout(() => {
    modal.style.display = "none";
    title.value = "";
    author.value = "";
    pages.value = "";
    status.checked = false;
  }, 500);
}

/**
 * Alternates book image from png to
 * gif
 */
function animateBookImage() {
  const bookImg = document.querySelector(".add-book-button img");

  if (bookImg.getAttribute("src") === "img/Book-animation.gif") {
    bookImg.setAttribute("src", "img/Book-static.png");
  } else {
    bookImg.setAttribute("src", "img/Book-animation.gif");
  }
}

/**
 * Checks if form field is missing and displays
 * error message if needed.
 *
 * @param {Node} element
 * @returns - If field is missing
 */
function checkFieldMissing(element) {
  //The id will correspond with what data the field is getting
  let elementType = element.getAttribute("id");

  if (element.validity.valueMissing) {
    //Display custom error message depending on type
    switch (elementType) {
      case "title":
        element.setCustomValidity("Book must have title.");
        element.reportValidity();
        break;
      case "author":
        element.setCustomValidity("Book must have an author.");
        element.reportValidity();
        break;
      case "pages":
        element.setCustomValidity("Book must have number of pages.");
        element.reportValidity();
        break;
    }
    return true;
  } else {
    //Set field as valid for now
    element.setCustomValidity("");
    return false;
  }
}

/**
 * Will check if the pages <input> element
 * is greater than the minimum value of 1
 *
 * @param {node} pages
 * @returns - If element is in out of range
 */
function checkPageUnderFlow(pages) {
  if (pages.validity.rangeUnderflow) {
    //Display custom error message
    pages.setCustomValidity("Number of pages must be greater than 1.");
    pages.reportValidity();
    return true;
  } else {
    //Set element to valid
    pages.setCustomValidity("");
    return false;
  }
}

main();
