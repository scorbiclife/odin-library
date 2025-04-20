function Book(title, author, pages, read) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pageCount = pages;
  this.read = read;
}

Book.prototype.readInfoAsString = function () {
  return this.read ? "read" : "not read yet";
};

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${
    this.pageCount
  } pages, ${this.readInfoAsString()}`;
};

const myLibrary = [];

function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
}

addBookToLibrary("Foo", "Foo Author", 1500, true);
addBookToLibrary("Bar", "Bar Author", 1110, false);

function createBookEntry(book) {
  const $bookRow = document.createElement("tr");

  const $id = document.createElement("td");
  $id.textContent = book.id;

  const $title = document.createElement("td");
  $title.textContent = book.title;

  const $author = document.createElement("td");
  $author.textContent = book.author;

  const $pages = document.createElement("td");
  $pages.textContent = book.pageCount;

  const $read = document.createElement("td");
  $read.textContent = book.readInfoAsString();

  $bookRow.append($id, $title, $author, $pages, $read);

  return $bookRow;
}

function displayLibrary() {
  const $libraryEntries = document.getElementById("library-entries");
  const $libraryEntryElements = myLibrary.map(createBookEntry);
  $libraryEntries?.replaceChildren(...$libraryEntryElements);
}

displayLibrary();

const newBookDialog =
  /** @type {HTMLDialogElement} */
  (document.getElementById("new-book-dialog"));

function showNewBookDialog() {
  newBookDialog.showModal();
}

const newBookDialogForm =
  /** @type {HTMLFormElement} */
  (document.getElementById("new-book-dialog-form"));

const newBookActionHandlers = {
  create: function createNewBook() {
    const newBookDialogData = Object.fromEntries(
      new FormData(newBookDialogForm).entries()
    );
    const [title, author, pages, read] = [
      String(newBookDialogData.title),
      String(newBookDialogData.author),
      Number(newBookDialogData.pages),
      Boolean(newBookDialogData.read),
    ];
    addBookToLibrary(title, author, pages, read);
    displayLibrary();
  },
  cancel: function cancelNewBook() {
    return;
  },
};

function handleNewBookDialogClose() {
  newBookActionHandlers[newBookDialog.returnValue || "cancel"]();
}

newBookDialog.addEventListener("close", handleNewBookDialogClose);

const newBookDialogOpener = document.getElementById("new-book-dialog-open");
newBookDialogOpener?.addEventListener("click", showNewBookDialog);
