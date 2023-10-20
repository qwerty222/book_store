import styles from '../scss/book.module.scss';

function books() {
  const booksContainer = document.querySelector('.books-container');
  const content = `123 <br>
                  123 <br>
                  123 <br>
                  123 <br>
                  123 <br>
                  123 <br>
                  123 <br>
                  123 <br>
                  123 <br>
                  123 <br>
                  123 <br>
                  123 <br>
                  123 <br>
                  123 <br>
                  123 <br>`;

  const testContent = document.createElement('p');
  testContent.innerText = content;
  booksContainer.appendChild(testContent);
}

export default books;
