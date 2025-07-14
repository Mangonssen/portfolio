//#region Geräteerkennung

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
    console.log("Mobile device detected");
} else {
    console.log("Non-mobile device detected");
}

//#endregion

//#region DOM-Elemente & Globals

let lastUrlUpdate = 0;
const cursor = document.getElementById('cursor');
const navIcons = document.getElementsByClassName('nav-icon');
const contexts = document.getElementsByClassName('context-menu');
const carousel = document.getElementById('carousel');
/** @type {HTMLCollectionOf<HTMLElement>} */
const projectElements = /***/(document.getElementsByClassName('project'));
/** @type {HTMLCollectionOf<HTMLElement>} */
const popups = /***/(document.getElementsByClassName('popup-container'));
const closeButtons = document.getElementsByClassName('pu-close');

//#endregion

//#region Navigation & Sektionen

/**
 * @type {{a:HTMLAnchorElement,section:HTMLElement}[]}
 */
const sectionLinks = Array.from(document.getElementsByClassName('nav-link'))
    .filter(el => el instanceof HTMLAnchorElement)
    .map(el => ({
        a: /** @type {HTMLAnchorElement} */ (el),
        section: (document.querySelector(el.getAttribute("href") ?? ""))
    }))
    .filter(({ section }) => section && section instanceof HTMLElement)
    .map(({ a, section }) => {
        return {
            a: a,
            section: /** @type {HTMLElement} */(section)
        }
    });

/**
 * Prüft, welche Sektion sichtbar ist, markiert sie und navigiert bei Desktop ggf. dorthin.
 */
function checkCurrentSection() {
    const sectionCoverages = sectionLinks.map(({ a, section }) => ({
        a,
        section,
        coverage: getScreenCoverage(section)
    }));

    sectionCoverages
        .sort((a, b) => b.coverage - a.coverage)
        .forEach(({ a, section }, i) => {
            const active = i === 0;
            section.classList.toggle('active', active);
            a.classList.toggle('active', active);

            if (active /*&& !isMobileDevice()*/) {
                const href = a.getAttribute("href");
                if (href) {
                    // URL anpassen ohne Scroll / Reload:
                    updateUrl(href);
                }
            }
        });
}

let isScrollingFor = 0;
window.addEventListener('scroll', () => {
    // clearTimeout(isScrollingFor);
    // isScrollingFor = setTimeout(checkCurrentSection, 100);
    checkCurrentSection()
});

checkCurrentSection();

//#endregion

//#region Cursor-Verhalten

document.addEventListener('mousemove', function (event) {
    if (!(cursor instanceof HTMLElement)) return;
    cursor.style.left = event.clientX + 'px';
    cursor.style.top = event.clientY + 'px';
});

const pointerEls = document.querySelectorAll("a, .info");

for (let i = 0; i < pointerEls.length; i++) {
    pointerEls[i].addEventListener('mouseover', function () {
        updateCursorImage("resources/pointer.svg");
    });

    pointerEls[i].addEventListener('mouseout', function () {
        updateCursorImage("resources/cursor.svg");
    });
}

/**
 * @param {string} src
 */
function updateCursorImage(src) {
    if (!(cursor instanceof HTMLElement)) return;
    const cursorIMG = cursor.querySelector("img");
    if (cursorIMG) {
        cursorIMG.src = src;
    }
}

//#endregion

//#region Kontextmenüs bei Icons

for (let i = 0; i < navIcons.length; i++) {
    navIcons[i].addEventListener('mouseover', function () {
        const context = /** @type {HTMLElement} */ (contexts[i]);
        context.style.display = 'block';
    });

    navIcons[i].addEventListener('mouseout', function () {
        const context = /** @type {HTMLElement} */ (contexts[i]);
        context.style.display = 'none';
    });
}

//#endregion

//#region Karussell

/**
 * Scrollt das Karussell nach rechts zum nächsten Projekt.
 * Erhöht dabei den aktuellen Projektindex, sofern möglich.
 */
function scrollNext() {
    if (!carousel || !projectElements?.length) return;
    const curProject = Math.round(carousel.scrollLeft / projectElements[1].clientWidth);

    if (curProject < projectElements?.length) {
        carousel.scrollLeft += projectElements[curProject].offsetWidth;
    }

    console.log(`Scroll position: ${carousel.scrollLeft}`);
    console.log(`Current project index: ${curProject}`);
}

/**
 * Scrollt das Karussell nach links zum vorherigen Projekt.
 * Verringert dabei den aktuellen Projektindex, sofern möglich.
 */
function scrollPrev() {
    if (!carousel || !projectElements?.length) return;
    const curProject = Math.round(carousel.scrollLeft / projectElements[1].clientWidth);


    if (curProject > 0) {
        carousel.scrollLeft -= projectElements[curProject].offsetWidth;
    }

    console.log(`Scroll position: ${carousel.scrollLeft}`);
    console.log(`Current project index: ${curProject}`);
}

//#endregion Karussell

//#region Popup-Funktionalität

for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener('click', closePopup);
}

for (let i = 0; i < popups.length; i++) {
    popups[i].addEventListener('mouseover', function () {
        document.body.style.overflow = 'hidden';
    });

    popups[i].addEventListener('mouseout', function () {
        document.body.style.overflow = 'auto';
    });
}

/**
 * 
 * @param {Event} event 
 */
function doLightDismiss(event) {
    if (event instanceof MouseEvent) {
        const openPopup = [...popups]
            .find(popup => popup.matches('[style="display: flex;"]'))
            ?.querySelector(".popup");

        if (!openPopup) {
            return;
        }
        const rect = openPopup.getBoundingClientRect();
        const clickX = event.clientX;
        const clickY = event.clientY;

        const isClickInsidePopup =
            clickX >= rect.left &&
            clickX <= rect.right &&
            clickY >= rect.top &&
            clickY <= rect.bottom;

        if (!isClickInsidePopup) {
            closePopup();
        }
    } else if (event instanceof KeyboardEvent) {
        if (event.key === 'Escape') {
            closePopup();
        }
    }
}

/**
 * @param {string} project - Ein CSS-Selektor (z. B. ".class", "#id", "div > p")
 */
function openPopup(project) {
    let index = [...popups].findIndex(el => el.matches(project));
    if (index < 0) {
        console.error(`${project} not found`);
        return;
    }
    window.addEventListener("click", doLightDismiss);
    window.addEventListener("keydown", doLightDismiss);
    popups[index].style.display = 'flex';
}

function closePopup() {
    for (let i = 0; i < popups.length; i++) {
        popups[i].style.display = 'none';
    }
    window.removeEventListener("click", doLightDismiss);
    window.removeEventListener("keydown", doLightDismiss);
}

//#endregion

//#region Utility-Funktionen

/**
 * @param {HTMLElement} el
 * @returns {boolean}
 */
function isElementOutOffBounds(el) {
    const rect = el.getBoundingClientRect();
    return (
        (rect.top >= window.innerHeight || rect.bottom <= 0) ||
        (rect.right <= 0 || rect.left >= window.innerWidth)
    );
}

/**
 * @param {HTMLElement} el
 * @returns {{top:number, bottom:number, left:number, right:number}}
 */
function percentageInBounds(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    return {
        top: Math.max(0, Math.min(1, rect.top / windowHeight)),
        bottom: Math.max(0, Math.min(1, rect.bottom / windowHeight)),
        left: Math.max(0, Math.min(1, rect.left / windowWidth)),
        right: Math.max(0, Math.min(1, rect.right / windowWidth))
    };
}

/**
 * @param {HTMLElement} el
 * @returns {number}
 */
function getScreenCoverage(el) {
    const boundsPerc = percentageInBounds(el);
    const deltaHeight = Math.abs(boundsPerc.top - boundsPerc.bottom);
    const deltaWidth = Math.abs(boundsPerc.left - boundsPerc.right);
    return deltaHeight * deltaWidth;
}


/**
 * 
 * @param {string} href 
 */
function updateUrl(href) {
    const now = Date.now();
    if (now - lastUrlUpdate > 500 && href !== window.location.pathname) {
        history.replaceState(null, '', href);
        lastUrlUpdate = now;
    }
}

//#endregion
