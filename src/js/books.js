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

const showBooks = (booksData) => {
  booksData.items.forEach((book) => {
    const testContent = document.createElement('p');
    testContent.innerText = book.id;
    booksContainer.appendChild(testContent);
  });
};

const loadData = async (category, position = 0) => {
  try {
    const url = prepareUrl(position, category);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Что-то пошло не так! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    showBooks(data);

    return data;
  } catch (error) {
    console.error('Error: ', error);
  } finally {
    // do something
  }
};

function books() {
  document.addEventListener('DOMContentLoaded', () => {
    const d = loadData('Business');
    // showBooks(d);
  });

  document.querySelectorAll('.category').forEach((category) => {
    category.addEventListener('click', () => {
      booksContainer.innerHTML = '';
      const d = loadData(category.dataset.bookType);

      const activeCategory = document.querySelector('.active');
      activeCategory.classList.toggle('active');
      category.classList.toggle('active');

      // showBooks(d);
    });
  });
}

export default books;
