function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
        console.log("Mobile device detected");
        // Add any mobile-specific logic here
} else {
        console.log("Non-mobile device detected");
        // Add any desktop-specific logic here
}

if (!isMobileDevice()) {

        const navIcons = document.getElementsByClassName('nav-icon');
        /**
         * @type {{a:HTMLAnchorElement,section:HTMLElement|null}[]}
         */
        const sectionLinks = [...document.getElementsByClassName('nav-link')]
                .map(element => { return { el: element, href: element.getAttribute("href") }; })
                .map(({ el, href }) => { return { a: el, section: document.querySelector(href) } });

        for (let i = 0; i < navIcons.length; i++) {
                navIcons[i].addEventListener('mouseover', function (event) {

                        let context = document.getElementsByClassName('context-menu')[i];
                        context.style.display = 'block';
                });
        }

        for (let i = 0; i < navIcons.length; i++) {
                navIcons[i].addEventListener('mouseout', function (event) {

                        let context = document.getElementsByClassName('context-menu')[i];
                        context.style.display = 'none';
                });
        }

        document.addEventListener('mousemove', function (event) {
                const cursor = document.getElementById('cursor');
                cursor.style.left = event.clientX + 'px';
                cursor.style.top = event.clientY + 'px';
        });

        const links = document.getElementsByTagName("a");

        for (let i = 0; i < links.length; i++) {
                links[i].addEventListener('mouseover', function (event) {
                        cursor.children[0].children[0].src = "resources/pointer.svg";
                });
                links[i].addEventListener('mouseout', function (event) {
                        cursor.children[0].children[0].src = "resources/cursor.svg";
                });
        }

        const carousel = document.getElementById('carousel');

        function scrollNext() {
                carousel.scrollLeft += document.getElementsByClassName('project')[1].offsetWidth;
                console.log(carousel.scrollLeft);

                if (curProject < projects.length) {
                        curProject++;
                }
                projectQuery();
                console.log(curProject);
        }

        function scrollPrev() {
                carousel.scrollLeft -= 1000;
                console.log(carousel.scrollLeft);

                if (curProject > 0) {
                        curProject--;
                }
                projectQuery();
                console.log(curProject);
        }

        /**  Funktion, die überprüft, ob ein Element im Viewport ist
         * @param {HTMLElement} el 
        */
        function isElementOutOffBounds(el) {
                const rect = el.getBoundingClientRect();

                return (
                        (rect.top >= window.innerHeight || rect.bottom <= 0) ||
                        (rect.right <= 0 || rect.left >= window.innerWidth)
                );
        }

        /**
         * 
         * @param {HTMLElement} el 
         * @returns top = 0, wenn out of bound; bottom = 1, wenn out of bound; left = 0, wenn out of bound; right = 1, wenn out of bound;
         */
        function percentageInBounds(el) {
                const rect = el.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const windowWidth = window.innerWidth;

                const topPercentage = Math.max(0, Math.min(1, (rect.top / windowHeight)));
                const bottomPercentage = Math.max(0, Math.min(1, ((windowHeight - rect.bottom) / windowHeight)));

                const leftPercentage = Math.max(0, Math.min(1, (rect.left / windowWidth)));
                const rightPercentage = Math.max(0, Math.min(1, ((windowWidth - rect.right) / windowWidth)));

                return { top: topPercentage, bottom: bottomPercentage, left: leftPercentage, right: rightPercentage };
        }

        function coverage(el) {

                const boundsPerc = percentageInBounds(el);
                const deltaHeight = Math.abs(boundsPerc.top - boundsPerc.bottom);
                const deltaWidth = Math.abs(boundsPerc.left - boundsPerc.right);

                const coverage = deltaHeight * deltaWidth;

                return coverage;
        }

        // Funktion, um die aktuell sichtbare Sektion zu bestimmen
        function checkCurrentSection() {

                /* sectionLinks.forEach(({ a, section }) => {
                        if (!isElementOutOffBounds(section)) {
                                // Wenn das Element im Viewport ist, setze es als aktiv
                                section.classList.add('active');
                                a.classList.add('active');
                                console.log(`Aktuelle Sektion: ${section.id}`);
                                window.location = a.getAttribute("href");
        
                                // Wenn die Sektion "projects" ist und das aktuelle Projekt 0 ist, setze den URL-Parameter auf "icons"
                                if (section.id == "projects" && curProject == 0) {
        
                                        let url = new URL(window.location);
                                        url.searchParams.set('p', "icons");
                                        window.history.replaceState({}, '', url);
                                }
        
                        } else {
                                // Andernfalls entferne die aktive Klasse
                                section.classList.remove('active');
                                a.classList.remove('active');
                        }
                }); */

                sectionLinks.map(({ a, section }) => {
                        const coverage = coverage(section);

                        return { a, section, coverage };
                }).sort((a, b) => {
                        return b.coverage - a.coverage;
                }).forEach(({ a, section }, i) => {
                        if (i == 0) {
                                section.classList.add('active');
                                a.classList.add('active');
                                console.log(`Aktuelle Sektion: ${section.id}`);
                                window.location = a.getAttribute("href");

                                // Wenn die Sektion "projects" ist und das aktuelle Projekt 0 ist, setze den URL-Parameter auf "icons"
                                if (section.id == "projects" && curProject == 0) {

                                        let url = new URL(window.location);
                                        url.searchParams.set('p', "icons");
                                        window.history.replaceState({}, '', url);
                                }
                        } else {
                                section.classList.remove('active');
                                a.classList.remove('active');
                        }
                });

                console.log()
        }
        checkCurrentSection()

        let isScrolling;
        window.addEventListener('scroll', () => {
                // Verhindert, dass die Funktion bei jedem Scrollen sofort aufgerufen wird
                window.clearTimeout(isScrolling);

                // Nach einer kurzen Verzögerung die `checkCurrentSection`-Funktion ausführen
                isScrolling = setTimeout(() => {
                        checkCurrentSection();
                }, 100); // 100ms Verzögerung, nach der der Scrollvorgang als abgeschlossen gilt
        });

        const projects = [
                "icons",
                "taddle",
                "loading",
                "printer"
        ];

        var curProject = 0;

        //PROJECT QUERY EVENT LISTENER
        carousel.addEventListener('scroll', projectQuery());

        function projectQuery() {

                const projectsSection = document.querySelector('#projects');
                if (projectsSection && !isElementOutOffBounds(projectsSection)) {

                        console.log("Hallo");

                        let currentProject = projects[curProject];
                        const url = new URL(window.location);
                        url.searchParams.set('p', currentProject);
                        window.history.replaceState({}, '', url);
                } else {

                }
        }

        const infoButtons = document.getElementsByClassName('info');
        const popups = document.getElementsByClassName('popup-container');

        document.addEventListener('click', function () {
                let isPopupVisible = Array.from(popups).some(popup => popup.style.display === 'flex');
                if (isPopupVisible) {
                        document.body.style.overflow = 'hidden';
                } else {
                        document.body.style.overflow = 'auto';
                }
        });

        for (let i = 0; i < infoButtons.length; i++) {
                infoButtons[i].addEventListener('click', function (event) {
                        let urlParams = new URLSearchParams(window.location.search);
                        let projectParam = urlParams.get('p');

                        let projectIndex = projects.indexOf(projectParam);
                        if (projectIndex !== -1) {
                                console.log(`Project found at index: ${projectIndex}`);
                        } else {
                                console.log('Project not found in the array.');
                        }

                        console.log(popups[projectIndex]);
                        popups[projectIndex].style.display = 'flex';
                });
        }

        const closeButtons = document.getElementsByClassName('pu-close');

        for (let i = 0; i < closeButtons.length; i++) {
                closeButtons[i].addEventListener('click', function (event) {
                        closePopup();
                });
        }

        function closePopup() {
                for (let i = 0; i < popups.length; i++) {
                        popups[i].style.display = 'none';
                }
        }

}