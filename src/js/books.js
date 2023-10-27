import styles from '../scss/book.module.scss';
import cover from '../img/cover.png';

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
      throw new Error(`Что-то пошло не так! status: ${response.status}`);
    }

    const data = await response.json();

    result = data.items;
  } catch (error) {
    booksContainer.innerText = `Error: ${error}`;
  }

  return result;
};

const createBook = (bookData) => {
  // root
  const book = document.createElement('div');
  book.classList.add(styles.book);

  // book cover
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add(styles['image-wrapper']);
  const img = document.createElement('img');
  if (bookData.volumeInfo.imageLinks !== undefined) {
    img.src = bookData.volumeInfo.imageLinks.thumbnail;
  } else {
    img.src = cover;
  }
  imageWrapper.appendChild(img);
  book.appendChild(imageWrapper);

  // content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add(styles['content-wrapper']);

  // authors
  if (bookData.volumeInfo.authors !== undefined) {
    bookData.volumeInfo.authors.forEach((author) => {
      const authorElement = document.createElement('p');
      authorElement.classList.add(styles.author);
      authorElement.innerText = author;
      contentWrapper.appendChild(authorElement);
    });
  }

  // title
  const title = document.createElement('p');
  title.classList.add(styles.title);
  title.innerText = bookData.volumeInfo.title;
  contentWrapper.appendChild(title);

  // averageRating

  // ratingsCount

  // description
  const description = document.createElement('p');
  description.classList.add(styles.description);
  description.innerText = bookData.volumeInfo.description;
  contentWrapper.appendChild(description);

  // items[0].saleInfo.saleability        NOT_FOR_SALE
  // saleInfo.retailPrice ??
  const price = document.createElement('p');
  price.classList.add(styles.price);
  if (bookData.saleInfo !== undefined && bookData.saleInfo.retailPrice !== undefined) {
    price.innerText = bookData.saleInfo.retailPrice;
  } else {
    price.innerText = '---';
  }
  contentWrapper.appendChild(price);

  // const keys = Object.keys(localStorage);
  // for(const key of keys) {
  //   alert(`${key}: ${localStorage.getItem(key)}`);
  // }

  // buy button
  const buyButton = document.createElement('button');
  buyButton.innerText = 'buy now';
  buyButton.classList.add(styles['buy-button']);
  buyButton.addEventListener('click', () => {
    const cart = document.querySelector('.cart-counter');
    cart.style.display = 'block';
    // get count
    const count = 0;
    cart.innerText = count;
    // check if book id in cart and add item id in storage
    localStorage.setItem(bookData.id, 1);
    buyButton.innerText = 'in the cart';
  });
  contentWrapper.appendChild(buyButton);

  book.appendChild(contentWrapper);

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
