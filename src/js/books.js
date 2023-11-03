import styles from '../scss/book.module.scss';
import cover from '../img/cover.png';
import goldStar from '../img/gold.svg';
import greyStar from '../img/gray.svg';

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
  let result = null;
  try {
    const url = prepareUrl(position, category);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Oops. status: ${response.status}`);
    }

    const data = await response.json();

    result = data.items;
  } catch (error) {
    booksContainer.innerText = `Error: ${error}`;
  }

  return result;
};

const convertData = (items) => {
  const booksArray = [];
  items.forEach((item) => {
    const book = {};
    book.id = item.id;
    const vi = item.volumeInfo;
    const si = item.saleInfo;
    book.title = vi.title;

    if (!vi.authors) {
      book.authors = 'Unknown';
    } else if (vi.authors.length === 1) {
      const author = vi.authors[0];
      book.authors = author;
    } else if (vi.authors.length > 1) {
      book.authors = vi.authors.join(', ');
    }

    book.authors = vi.authors;
    book.cover = !vi.imageLinks ? cover : vi.imageLinks.thumbnail;
    book.description = vi.description || ' ';
    book.rating = vi.averageRating;
    book.reviews = vi.ratingsCount || 0;

    if (
      si.saleability === 'FREE'
      || (si.saleability === 'FOR_SALE' && si.listPrice.amount === 0)
    ) {
      book.price = 'free';
      book.currency = ' ';
    } else if (si.saleability === 'FOR_SALE') {
      book.price = si.listPrice.amount;
      book.currency = si.listPrice.currencyCode;
    } else if (si.saleability === 'NOT_FOR_SALE') {
      book.price = 'not for sale';
      book.currency = ' ';
    }
    booksArray.push(book);
  });
  return booksArray;
};

const CART_KEY = 'cart_book_ids';

const getSavedBookIds = () => {
  let result = [];
  const bookArrayString = localStorage.getItem(CART_KEY);
  if (bookArrayString) {
    result = bookArrayString.split(',');
  }

  return result;
};

const saveBookId = (id) => {
  const ids = getSavedBookIds();
  const saved = ids.includes(id);
  if (!saved) {
    ids.push(id);
    localStorage.setItem(CART_KEY, ids.toString());
  }
};

const setCartBookCounter = () => {
  const cart = document.querySelector('.cart-counter');
  cart.style.display = 'flex';
  cart.innerText = getSavedBookIds().length;
};

const getStars = (rating) => {
  let stars = '';
  const goldStarCount = !rating ? 0 : Math.floor(rating);
  const grayStarCount = 5 - goldStarCount;
  for (let i = 0; i < goldStarCount; i += 1) {
    stars += `<img src="${goldStar}" class="star">`;
  }
  for (let j = 0; j < grayStarCount; j += 1) {
    stars += `<img src="${greyStar}" class="star">`;
  }

  return stars;
};

const createBook = (bookData) => {
  const book = document.createElement('div');
  book.classList.add(styles.book);

  const ids = getSavedBookIds();
  const saved = ids.includes(bookData.id);

  const html = `<div class="${styles['image-wrapper']}">
                 <img src="${bookData.cover}" alt>
                </div>
                <div class="${styles['content-wrapper']}">
                  <p class="${styles.author}">${bookData.authors}</p>
                  <p class="${styles.title}">${bookData.title}</p>
                  <div class="stars">
                    ${getStars(bookData.rating)}
                    <span class="${styles.reviews}">${bookData.reviews} review</span>
                  </div>
                  <p class="${styles.description}">${bookData.description}</p>
                  <p class="${styles.price}">${bookData.currency} ${bookData.price}</p>
                  <button id="${bookData.id}" data-book-id="${bookData.id}" class="${styles['buy-button']}">
                    ${saved ? 'in the cart' : 'buy now'}
                  </button>
                </div>`;

  book.innerHTML = html;

  return book;
};

const showBooks = async (category, position = 0) => {
  const data = await loadData(category, position);
  const booksArray = convertData(data);
  booksArray.forEach((book) => {
    booksContainer.appendChild(createBook(book));

    const btn = document.getElementById(book.id);
    btn.addEventListener('click', () => {
      saveBookId(book.id);
      const buyButton = btn;
      buyButton.innerText = 'in the cart';
      setCartBookCounter(book.id);
    });
  });
};

function books() {
  document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem(CART_KEY, '');
    showBooks('Architecture');
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

  document.querySelector('.button-load').addEventListener('click', () => {
    const activeCategory = document.querySelector('.active');
    const position = document.querySelectorAll(`.${styles.book}`).length;
    showBooks(activeCategory.dataset.bookType, position);
  });
}

export default books;
