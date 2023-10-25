import styles from '../scss/book.module.scss';

const API_KEY = 'AIzaSyCeP9nI2eoIk_3I9uSLg8TsJ7ZfHRl9U6k';
const MAX_RESULTS = 6;
const PRINT_TYPE = 'books';
const LANG = 'en';

const prepareUrl = (startPosition, category) => {
  const params = new URLSearchParams({
    q: `subject:${category}`,
    key: API_KEY,
    printType: PRINT_TYPE,
    startIndex: startPosition,
    maxResults: MAX_RESULTS,
    langRestrict: LANG,
  });

  return `https://www.googleapis.com/books/v1/volumes?${params}`;
};

const booksContainer = document.querySelector('.books-container');

const loadData = async (category, position = 0) => {
  try {
    const url = prepareUrl(position, category);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Что-то пошло не так! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    return data.items;
  } catch (error) {
    booksContainer.innerText = `Error: ${error}`;
  }

  return null;
};

const createBook = (bookData) => {
  const book = document.createElement('div');

  const title = document.createElement('p');
  title.innerText = bookData.volumeInfo.title;
  book.appendChild(title);

  if (bookData.volumeInfo.imageLinks !== undefined) {
    const img = document.createElement('img');
    img.src = bookData.volumeInfo.imageLinks.thumbnail;
    book.appendChild(img);
  }

  return book;
};

const showBooks = async (category, position = 0) => {
  const booksData = await loadData(category, position);
  booksData.forEach((book) => {
    booksContainer.appendChild(createBook(book));
  });
};

function books() {
  document.addEventListener('DOMContentLoaded', () => {
    showBooks('Business');
  });

  document.querySelectorAll('.category').forEach((category) => {
    category.addEventListener('click', () => {
      booksContainer.innerHTML = '';
      showBooks(category.dataset.bookType);
      const activeCategory = document.querySelector('.active');
      activeCategory.classList.toggle('active');
      category.classList.toggle('active');
    });
  });

  const loadMoreButton = document.querySelector('.button-load');
  loadMoreButton.addEventListener('click', () => {
    const activeCategory = document.querySelector('.active');
    const position = 0;
    showBooks(activeCategory.dataset.bookType, position);
  });
}

export default books;
