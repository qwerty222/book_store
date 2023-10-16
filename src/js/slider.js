import banner1 from '../img/banner_1.png';
import banner2 from '../img/banner_2.png';
import banner3 from '../img/banner_3.png';

const banners = [banner1, banner2, banner3];

function slider() {
  const img = document.querySelector('.slider-image');
  const dots = Array.from(document.querySelectorAll('.slider-dot'));

  let currentItem = 0;
  const dotActive = 'dot-active';

  function changeDot(index) {
    const activeDot = document.querySelector(`.${dotActive}`);
    activeDot.classList.toggle(dotActive);
    dots[index].classList.toggle(dotActive);

    img.src = banners[index];
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = dots.indexOf(dot);
      currentItem = index;
      changeDot(index);
    });
  });

  window.addEventListener('DOMContentLoaded', () => {
    changeDot(currentItem);
    setInterval(() => {
      currentItem += 1;
      if (currentItem > 2) {
        currentItem = 0;
      }
      changeDot(currentItem);
    }, 5000);
  });
}

export default slider;
