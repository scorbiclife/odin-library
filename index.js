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

let myLibrary = [];

function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
}

function removeBookEntry(bookIdToRemove) {
  myLibrary = myLibrary.filter((book) => book.id !== bookIdToRemove);
}

function handleBookRemovingClick(event) {
  const bookIdToRemove = String(event.currentTarget.dataset.id);
  updateAndDisplayLibrary(() => removeBookEntry(bookIdToRemove));
}

function handleBookReadStatusTogglingClick(event) {
  const $bookEntry = event.currentTarget;
  const book = myLibrary.find((book) => book.id === $bookEntry.dataset.id);
  if ((book ?? null) === null) {
    return;
  }
  updateAndDisplayLibrary(() => (book.read = !book.read));
}

function handleBookNoOpClick() {}

const bookEntryActionHandlers = {
  remove: handleBookRemovingClick,
  toggleRead: handleBookReadStatusTogglingClick,
  noop: handleBookNoOpClick,
};

function handleBookEntryClick(event) {
  const actionName = event.target.dataset.action ?? "noop";
  const handler = bookEntryActionHandlers[actionName];
  handler(event);
}

function createBookEntry(book) {
  const $title = document.createElement("td");
  $title.textContent = book.title;

  const $author = document.createElement("td");
  $author.textContent = book.author;

  const $pages = document.createElement("td");
  $pages.textContent = book.pageCount;

  const $read = document.createElement("td");
  $read.textContent = book.readInfoAsString();

  const $bookRemover = document.createElement("button");
  $bookRemover.dataset.action = "remove";
  $bookRemover.textContent = "Remove Book";
  const $bookRemoveCell = document.createElement("td");
  $bookRemoveCell.append($bookRemover);

  const $bookReadStatusToggler = document.createElement("button");
  $bookReadStatusToggler.dataset.action = "toggleRead";
  $bookReadStatusToggler.textContent = book.read
    ? "Mark as unread"
    : "Mark as read";
  const $bookReadStatusToggleCell = document.createElement("td");
  $bookReadStatusToggleCell.append($bookReadStatusToggler);

  const $bookEntry = document.createElement("tr");
  $bookEntry.append(
    $title,
    $author,
    $pages,
    $read,
    $bookRemoveCell,
    $bookReadStatusToggleCell
  );
  $bookEntry.dataset.id = book.id;
  $bookEntry.addEventListener("click", handleBookEntryClick);

  return $bookEntry;
}

function displayLibrary() {
  const $libraryEntries = document.getElementById("library-entries");
  const $libraryEntryElements = myLibrary.map(createBookEntry);
  $libraryEntries?.replaceChildren(...$libraryEntryElements);
}

function updateAndDisplayLibrary(libraryUpdateFn) {
  libraryUpdateFn();
  displayLibrary();
}

/** Initialize and display library */

updateAndDisplayLibrary(function initLibrary() {
  addBookToLibrary("Foo", "Foo Author", 1500, true);
  addBookToLibrary("Bar", "Bar Author", 1110, false);
});

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
    updateAndDisplayLibrary(() => addBookToLibrary(title, author, pages, read));
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
