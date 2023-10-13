import banner1 from './img/banner_1.png';
import banner2 from './img/banner_2.png';
import banner3 from './img/banner_3.png';

function slider() {
  const dots = Array.from(document.querySelectorAll('.slider-dot'));

  let currentItem = 0;

  function changeDot(index) {
    const activeDot = document.querySelector('.dot-active');
    activeDot.classList.toggle('dot-active');
    dots[index].classList.toggle('dot-active');
  }

  const sliderPictures = document.querySelector('.main__slider-picture');

  window.addEventListener('DOMContentLoaded', () => {
    showPicture(currentItem);
    setInterval(change, 5000);
  });
}

export default slider;
