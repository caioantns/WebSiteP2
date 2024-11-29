let count = 1;
document.getElementById("radio1").checked = true;

let interval = setInterval(nextImage, 5000);

function nextImage() {
  count++;
  if (count > 4) {
    count = 1;
  }
  document.getElementById("radio" + count).checked = true;
}


const carousel = document.getElementById("carousel");

carousel.addEventListener("mouseenter", function () {
  clearInterval(interval); 
});

carousel.addEventListener("mouseleave", function () {
  interval = setInterval(nextImage, 5000); 
});





document.addEventListener("DOMContentLoaded", () => {

    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const menu = document.querySelector(".menu ul");
  
    hamburgerMenu.addEventListener("click", () => {
      menu.classList.toggle("active");
    });

    const carousels = document.querySelectorAll(".carousel-container");
  
    carousels.forEach((carouselContainer) => {
      const carousel = carouselContainer.querySelector(".carousel-empregos");
      const prevBtn = carouselContainer.querySelector(".prev-btn");
      const nextBtn = carouselContainer.querySelector(".next-btn");
  
      let offset = 0;
  
      prevBtn.addEventListener("click", () => {
        const cardWidth = carousel.querySelector(".card").offsetWidth + 20; 
        offset = Math.min(offset + cardWidth, 0); 
        carousel.style.transform = `translateX(${offset}px)`;
      });
  
      nextBtn.addEventListener("click", () => {
        const cardWidth = carousel.querySelector(".card").offsetWidth + 20;
        const maxOffset = -(carousel.scrollWidth - carouselContainer.offsetWidth);
        offset = Math.max(offset - cardWidth, maxOffset); 
        carousel.style.transform = `translateX(${offset}px)`;
      });
    });
  });

