// Carousel *********
// ------------------

const slidesWrapper = document.querySelector(".carousel_slides-wrapper"); // ul
const slides = Array.from(slidesWrapper.children); // Marrim te gjithe li (queryselectorAll)
const nextBtn = document.querySelector(".carousel_button--right");
const prevBtn = document.querySelector(".carousel_button--left");

// Initial slide width
let slideWidth = slides[0].getBoundingClientRect().width;

// Function to set the position of each slide
const setSlidePosition = (slides) => {
    slideWidth = slides[0].getBoundingClientRect().width; // Get the new slide width
    slides.forEach((slide, index) => {
        slide.style.left = `${slideWidth * index}px`;
    });
    updateCurrentSlideTransform();
};

// Function to update the transform property based on the current slide
const updateCurrentSlideTransform = () => {
    const currentSlide = document.querySelector(".current-slide"); // li
    slidesWrapper.style.transform = `translateX(-${currentSlide.style.left})`;
};

// Function to move to the target slide
const moveToSlide = (targetSlide, fallbackSlide) => {
    if (slidesWrapper.style.transition === "none 0s ease 0s") {
        slidesWrapper.style.transition = "transform 0.25s ease";
    } // After resize set the transition back to normal

    const slideToMove = targetSlide || fallbackSlide;
    const amountToMove = slideToMove.style.left;
    slidesWrapper.style.transform = `translateX(-${amountToMove})`;
    slideToMove.classList.add("current-slide");

    const currentSlide = document.querySelector(".current-slide");
    currentSlide.classList.remove("current-slide");
    slideToMove.classList.add("current-slide");
};

// Function to hide slides that are not current
const hideNotCurrentSlides = () => {
    const notCurrentSlides = document.querySelectorAll("li:not(.current-slide)");
    const currentSlide = document.querySelector(".current-slide");
    notCurrentSlides.forEach(slide => slide.style.opacity = 0);
    currentSlide.style.opacity = 1;
};

// Function to handle the next button click
const handleNextButtonClick = () => {
    const currentSlide = document.querySelector(".current-slide");
    const nextSlide = currentSlide.nextElementSibling;
    const firstSlide = slidesWrapper.firstElementChild;
    moveToSlide(nextSlide, firstSlide);
    hideNotCurrentSlides();
};

// Function to handle the previous button click
const handlePrevButtonClick = () => {
    const currentSlide = document.querySelector(".current-slide");
    const prevSlide = currentSlide.previousElementSibling;
    const lastSlide = slidesWrapper.lastElementChild;
    moveToSlide(prevSlide, lastSlide);
    hideNotCurrentSlides();
};

// Function to handle window resize
const onResize = () => {
    setSlidePosition(slides);
    slidesWrapper.style.transition = "none"; // Temporarily disable transition during resize
    updateCurrentSlideTransform();
    setTimeout(() => {
        slidesWrapper.style.transition = "transform 0.25s ease"; // Restore transition
    }, 100);
};

// Initialize slide positions and add event listeners
const initializeCarousel = () => {
    setSlidePosition(slides);

    nextBtn.addEventListener("click", handleNextButtonClick);
    prevBtn.addEventListener("click", handlePrevButtonClick);

    window.addEventListener("resize", () => {
        clearTimeout(window.resizedFinished); // Wait until resize is finished
        window.resizedFinished = setTimeout(onResize, 100);
    });
};

// Initialize the carousel on DOM content loaded
document.addEventListener("DOMContentLoaded", initializeCarousel);
