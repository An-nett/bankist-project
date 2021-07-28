'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const nav = document.querySelector('.nav');

const scrollToBtn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const navLinks = document.querySelector('.nav__links');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const header = document.querySelector('.header');

const allSections = document.querySelectorAll('.section');

const imgTargets = document.querySelectorAll('img[data-src]');

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Scrolling

//More old-fashioned way

// scrollToBtn.addEventListener('click', function() {
//     const scrollToCoords = section1.getBoundingClientRect();
//     console.log(scrollToBtn);
//     console.log(section1);
//     console.log(scrollToCoords);
//     window.scrollTo({
//         left: scrollToCoords.left + window.pageXOffset,
//         top: scrollToCoords.top + window.pageYOffset,
//         behavior: 'smooth',
//     });
// });

//Modern way (not for all browsers)

scrollToBtn.addEventListener('click', function() {
    section1.scrollIntoView({behavior: 'smooth'});
})

//Scrollind from nav section

navLinks.addEventListener('click', function(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains('nav__link')) {
        const id = evt.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({behavior: 'smooth'});
    }
})

//Tabbed Component

tabContainer.addEventListener('click', function(evt) {
    const clicked = evt.target.closest('.operations__tab');

    if (!clicked) return;

    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));

    clicked.classList.add('operations__tab--active');
    document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
})

//Menu links animation

function handleHover(evt) {
    if (evt.target.classList.contains('nav__link')) {

        const link = evt.target;
        const siblings = evt.target.closest('.nav').querySelectorAll('.nav__link');
        const logo = evt.target.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky Navigation

const navHeight = nav.getBoundingClientRect().height;

function stickyNav(entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
})

headerObserver.observe(header);

//Revealing Sections

function revealSection(entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0,
});

allSections.forEach(function(section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
})

//Lazy Loading Images

function lazyLoad(entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function() {
        entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(lazyLoad, {
    root: null,
    threshold: 0,
    rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));

//Slider

function slider() {

const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');

const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length - 1;

function activateDot(slide) {
    document
        .querySelectorAll('.dots__dot')
        .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
        .querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList.add('dots__dot--active');
}

function goToSlide(slide) {
    slides.forEach(
        (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
        )
}

function createDots() {
    slides.forEach(function(_, i) {
        dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`);
    })
}

function init() {
    goToSlide(0);
    createDots();
    activateDot(0);
}

init();

function nextSlide() {
    if (curSlide === maxSlide) {
        curSlide = 0;
    } else {
        curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
}

function prevSlide() {
    if (curSlide === 0) {
        curSlide = maxSlide;
    } else {
        curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
}

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function(evt) {
    if (evt.key === 'ArrowRight') nextSlide()
    if (evt.key === 'ArrowLeft') prevSlide()
});

dotContainer.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('dots__dot')) {
        const {slide} = evt.target.dataset;
        goToSlide(slide);
        activateDot(slide);
    }
})
}
slider();
