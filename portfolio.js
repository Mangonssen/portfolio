/* COLORS */
const primary = "#505050";
const secondary = "#FFFFFF" ;

const title = document.getElementsByClassName('name-title');

const sections = ['title', 'about-me', 'projects', 'contact'];

/*
title 0
about-me 1
projects 2
contact 3
*/

var currSection = 0;


function scrollToSection(sectionNO) {
    console.log("Scrolling to: " + sections[sectionNO]);
    document.getElementById(sections[sectionNO]).scrollIntoView({behavior: 'smooth'});

    currSection = sectionNO;
}


//EVENT LISTENERS

document.addEventListener('mousemove', function(event) {
    const cursor = document.getElementById('cursor');
    cursor.style.left = event.clientX + 'px';
    cursor.style.top = event.clientY + 'px';
});

document.addEventListener('mouseout', function() {
    const interval = setInterval(function() {
        for (let i = 0; i < title.length; i++) {
            let currentBackground = title[i].style.background;
            let match = currentBackground.match(/(\d+)%\)$/);
            if (match) {
                let currentPercentage = parseInt(match[1]);
                if (currentPercentage > 0) {
                    currentPercentage--;
                    title[i].style.background = `linear-gradient(to bottom, ${secondary} 0%, ${primary} ${currentPercentage}%)`;
                } else {
                    clearInterval(interval);
                }
            }
        }
    }, 50);
        
});

const jmpBtn = document.getElementById("jump-button");

jmpBtn.addEventListener('click', function() {
    console.log("Jump Button was pressed");
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

jmpBtn.addEventListener('mouseover', function() {
    
    document.getElementById("jump-img").style.marginLeft = "50x";
    jmpBtn.innerHTML = "Jump to Top <img src='jump-button.png' alt='Jump' id='jump-img'>";
    jmpBtn.style.width = "auto";
});

jmpBtn.addEventListener('mouseout', function() {
    jmpBtn.innerHTML = "<img src='jump-button.png' alt='Jump' id='jump-img'>";
});


// Scroll down
document.addEventListener('wheel', function(event) {
    console.log("current section: " + currSection);
    if (event.deltaY > 0) {
        let nextSection = currSection + 1;
        if (nextSection >= sections.length) {
            nextSection = sections.length - 1; // Stay at the last section
        }
        scrollToSection(nextSection);
        currSection = nextSection;
    }
});

// Scroll up
document.addEventListener('wheel', function(event) {
    if (event.deltaY < 0) {
        let prevSection = currSection - 1;
        if (prevSection < 0) {
            prevSection = 0; // Stay at the first section
        }
        scrollToSection(prevSection);
        console.log("current section: " + currSection);
        console.log("prev section: " + prevSection);
        currSection = prevSection;
    }
});



