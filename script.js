let book1 = new Book("Lord", "P", 23, false);
let book2 = new Book("Lord", "P", 22, false);
let book3 = new Book("Lord", "P", 21, false);

let myLibrary = [book1, book2, book3];

function main(){
    renderTable();
    addEventListeners();
}

/**constructor */
function Book(title, author, pages, status){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;

    this.createRow = () => {
        const newRow = document.createElement("tr");
        const statusButton = document.createElement("button");
        const removeButton = document.createElement("button");
        
        newRow.appendChild(document.createElement("td")).innerText = `${this.title}`;
        newRow.appendChild(document.createElement("td")).innerText = `${this.author}`;
        newRow.appendChild(document.createElement("td")).innerText = `${this.pages}`;
        newRow.appendChild(document.createElement("td")).appendChild(statusButton);
        newRow.appendChild(document.createElement("td")).appendChild(removeButton);

        statusButton.classList.add("status-button");
        removeButton.classList.add("remove-button");
        
        statusButton.innerText = `${this.status ? "Read": "Not Read"}`;
        removeButton.innerText = "Remove";

        statusButton.addEventListener('click', changeStatus);
        removeButton.addEventListener('click', removeBook);
        
        myLibrary.forEach((book, index) => {
            if(this === book){
                newRow.setAttribute("data-book-number", `${index}`);
            }
        });

        return newRow;

    };
}

function addBookToLibrary(){
    const form = document.querySelector(".modal-form form");
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const pages = document.querySelector("#pages").value;
    const status = document.querySelector("#book-status").checked;

    if(form.checkValidity()){
        const bookTable = document.querySelector("table");
        let newBook = new Book(title, author, pages, status);
        myLibrary.push(newBook);

        fadeOutModal();
        setTimeout(() =>{
            title.value = "";
            author.value = "";
            pages.value = "";
        }, 500);

       
        bookTable.appendChild(newBook.createRow()); 
        renderTable();

    } else{
        form.reportValidity();
    }

}

function renderTable(){
    const tableHeader = document.querySelector("thead");
    const bookTable = document.querySelector("table");

    //Remove children from table except for header
    bookTable.replaceChildren(tableHeader);

    //Add book objects as children
    myLibrary.forEach((book) => {
        bookTable.appendChild(book.createRow());   
    });
    
}

function removeBook(){
    //Get the grandparent of the remove button, the <tr> element
    const row = this.parentNode.parentNode;
    
    myLibrary.forEach((book, index) => {       
        if(row.getAttribute("data-book-number") == index){
            myLibrary.splice(index, 1);
        }
    });

    renderTable();
    
}

function changeStatus(){
    //Get the grandparent of the status button, the <tr> element
    const row = this.parentNode.parentNode;

    myLibrary.forEach((book, index) => {       
        if(row.getAttribute("data-book-number") == index){
            book.status = !book.status; //change status to opposite of current status
            this.innerText = `${book.status ? "Read" : "Not Read"}`; //change button' inner text
        }
    });
    
}

function addEventListeners(){
    const modal = document.querySelector(".modal");
    const modalCloseButton = document.querySelector(".modal-form > span");
    const addBookButton = document.querySelector(".add-book-button button");
    const addFormButton = document.querySelector(".modal-form button");
 
    addBookButton.addEventListener('click', fadeInModal);
    addBookButton.addEventListener('mouseover', animateBookButton);
    addBookButton.addEventListener('mouseout', resetBookButton);
    modalCloseButton.addEventListener('click', fadeOutModal);
    addFormButton.addEventListener('click', addBookToLibrary);
    
    window.addEventListener('mousedown', (e) => {
        //If the modal is currently active disable it if user clicks outside of it
        if(e.target === modal){
           fadeOutModal();
        }
    });
}


function fadeInModal(){
    const modal = document.querySelector(".modal");

    modal.style.animation = "fadeIn .5s";
    modal.style.display = "block";
}

function fadeOutModal(){
    const modal = document.querySelector(".modal");

    modal.style.animation = "fadeOut .5s";
    setTimeout(() =>{
        modal.style.display = "none";
    }, 400);
}

function animateBookButton(){
    const bookImg = document.querySelector(".add-book-button img");
    bookImg.setAttribute("src", "img/Book-animation.gif");
    bookImg.setAttribute("alt", "book-animation");
}

function resetBookButton(){
    const bookImg = document.querySelector(".add-book-button img");
    bookImg.setAttribute("src", "img/Book-static.png");
    bookImg.setAttribute("alt", "book-static-image");
}

/**
 * Commit
 * Style each section one at a time
 * dont forget about form
 * Add commits along the way
 * push project
 */

main();