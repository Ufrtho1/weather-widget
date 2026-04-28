'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////////////////////////////////
// Page navigation

// document.querySelectorAll('.nav__link').forEach(link =>
//   link.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   }),
// );

// Event delagation
// 1. Add event listener to common parent element
// 2. Determin, what element originated the element

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    // console.log('link');
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component (01,02,03 - buttons)

// Bad practise
// tabs.forEach(tab => tab.addEventListener("click", () =>console.log("TAB")))

// events delegation
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();

  // it goes up even if we dont wanna
  // const clicked = e.target.parentElement;
  // we want closest operation tab or the operation tab, not anything else
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // Guard class
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active'),
  );

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
// any handler function can handler only e parameter
const handleHover = function (e) {
  // console.log(this);

  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// mouseenter is similiar, but doesnt bubble
// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////////////////////////////////////

// Sticky navigation
/*
// BAD PRACTISE!!!
// we take the dynamic position of section1
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener('scroll', function (e) {
  // console.log(e);
  console.log(window.scrollY);
  if (this.window.scrollY > initialCoords) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
*/

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// Sticky navigation: Intersection Observer API
// whenever the section1 intersecting the view-port (root) 10% (threshold), then the calback function will be called
/*
// Callback function
const obsCallback = function (entries, observer) {
  entries.forEach(entry => console.log(entry));
};

// options
const obsOptions = {
  // element that the target is intersecting
  root: null, //view port
  // when will be called
  //threshold: 0.1, //10%
  threshold: [0, 0.2],
};


// Intersection Observer API
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  //rootMargin: '-90px', //-90 px outside of element, before threshold
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  // const [entry] = entries; this give us a bug if we reload the page between sections
  // console.log(entry);
  // console.log(entries);

  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

// function
const loadImg = function (entries, observer) {
  // console.log(entries);

  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    // Replacing src with data-src
    entry.target.src = entry.target.dataset.src;
    // unbluring
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  });
};

// Observer
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

// selector
imgTargets.forEach(function (img) {
  imgObserver.observe(img);
  // picture.classList.remove('lazy-img');
});

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // functions
  // dots
  const createDots = function () {
    // slides.inHTML = '';
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`,
      );
    });
  };

  // dot Marker
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // 1. slide = 0%, 2. = 100% ...
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`),
    );
  };

  // next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    // mark dot after reload
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // key Left and Right + shortCircuiting example
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log('DOT');
      curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
};
slider();

/*
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// 198) Selecting, creating and deleting elments

// Selecting elements
console.log(document.documentElement); // whole HTML, CSS
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
// .insertAdjacentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent =
//   'We use cookies for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message); //add as a firstchild
header.append(message); //add as a lastchild
// header.append(message.cloneNode(true)); // this makes a clone, to exist twice

header.before(message); // makes as a sibling
// header.after(message);

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    // message.parentElement.removeChild(message); // old way, remove
  });

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// 199) Styles, Attributes and classes

// this makes an inline style HTML
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color); // we cant acces the css

console.log(getComputedStyle(message).color); // way how to acces CSS
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// Atributes
const logo = document.querySelector('.nav__logo');
// reading
console.log(logo.alt);
console.log(logo.className);

// Set
logo.alt = 'Beautiful minimalist logo';

// Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));

// Set a whole new attribute
logo.setAttribute('company', 'Bankist');

console.log(logo.src); //Absolute
console.log(logo.getAttribute('src')); //Relative

// links
const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes = special attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); //not includes as with js

// Dont use
logo.className = 'jonas';
*/ /*
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  */ /*
  // current position
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  // scrolled distance
  console.log('Current scroll (X/Y)', window.scrollX, window.scrollY);

  console.log(
    'height and width of viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth,
  );
  */ /*
  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.scrollX,
  //   s1coords.top + window.scrollY,
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  // modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great You are reading the headding :D');
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => {
  h1.removeEventListener('mouseenter', alertH1);
}, 3000);

// old-school
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great You are reading the headding :D');
// };

// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroungColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // Stop propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroungColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroungColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  },
  false,
);
*/
/*
///////////////////////////////////////////////////////////////////////////
// 205) DOM Traversing

const h1 = document.querySelector('h1');

// Going downwards: child = as deep as to reach
console.log(h1.querySelectorAll('.highlight'));

// direct child
console.log(h1.childNodes);
console.log(h1.children);

// first and last element child
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

// closest parent element that has header class
// closest = oposite of queryselector
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings
// only direct way
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

// for nodes
console.log(h1.previousSibling);
console.log(h1.nextSibling);

// all siblings = we moved to parent el and find all childrens
console.log(h1.parentElement.children);

// we want to change something on all the siblings except item itself
[...h1.parentElement.children].forEach(el => {
  if (el !== h1) {
    return (el.style.transform = 'scale(0.5');
  }
});
*/

///////////////////////////////////////////////////////////////////////////
// 215) Lifecycle DOM Events
// those times i can findu down in the Google terminal -> Network

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// if we wanna leave the site it will ask us to leave
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.return = '';
// });
