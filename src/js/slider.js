import styles from '../scss/slider.module.scss';

import banner1 from '../img/banner_1.png';
import banner2 from '../img/banner_2.png';
import banner3 from '../img/banner_3.png';

const banners = [banner1, banner2, banner3];

function slider() {
  const img = document.querySelector('.main__slider-image');
  const dots = Array.from(document.querySelectorAll('.slider-dot'));

  let currentItem = 0;

  function changeDot(index) {
    const activeDotClass = `.${styles.dotActive}`;
    const activeDot = document.querySelector(activeDotClass);
    activeDot.classList.toggle(activeDotClass);
    dots[index].classList.toggle(activeDotClass);
  }

  const changePicture = (index) => {
    img.src = banners[index];

    dots.forEach((dot) => {
      if (dots.indexOf(dot) === index) {
        dot.classList.add(styles.dotActive);
      } else {
        dot.classList.remove(styles.dotActive);
      }
    });
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const num = dots.indexOf(dot);
      currentItem = num;
      changePicture(num);
    });
  });

  window.addEventListener('DOMContentLoaded', () => {
    changePicture(currentItem);
    setInterval(changePicture, 5000);
  });
}

export default slider;
