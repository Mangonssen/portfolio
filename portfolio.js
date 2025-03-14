"use strict";

/* COLORS */
const primary = "#505050";
const secondary = "#FFFFFF" ;

const title = document.getElementsByClassName('name-title');

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

//EVENT LISTENERS


//Cursor
document.addEventListener('mousemove', function(event) {
    const cursor = document.getElementById('cursor');
    cursor.style.left = event.clientX + 'px';
    cursor.style.top = event.clientY + 'px';
});

//Redundant gradient handling
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

//Jump to top button
const jmpBtn = document.getElementById("jump-button");

jmpBtn.addEventListener('click', function() {
    console.log("Jump Button was pressed");
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const projects = document.getElementsByClassName('project');
const projectImgs = document.getElementsByClassName('project-img');

for (let i = 0; i < projects.length; i++) {
    projects[i].addEventListener('mouseover', function() {
        projectImgs[i].style.transform = 'z-index: 3';
        projectImgs[i].style.transform = 'scale(1.3)';
        projects[i].style.borderRadius = '10px';
        cursor.style.display = 'none';
        projects[i].style.cursor = 'pointer';
    });

    projects[i].addEventListener('mouseout', function() {
        projectImgs[i].style.transform = 'z-index: 1';
        projectImgs[i].style.transform = 'scale(1)';
        projects[i].style.borderRadius = '0px';
        cursor.style.display = 'block';
        projects[i].style.cursor = 'none';
    });

    projects[i].addEventListener('click', function() {
        if (i == 0) {
            document.getElementById("icons").style.display = "flex";

            document.getElementById("popup-close").addEventListener('click', function() {
                document.getElementById("icons").style.display = "none";
            });
        } else if (i == 1) {
            openNewPopup();
        } else if (i == 2) {
            openNewPopup();
        } else if (i == 3) {
            openNewPopup();
        } else if (i == 4) {
            openNewPopup();
        } else if (i == 5) {
            openNewPopup();
        }
    });
}

function openNewPopup() {
    document.getElementById("new-popup").style.display = "flex";

            document.getElementById("new-popup-close").addEventListener('click', function() {
                console.log("Close button was pressed");
                document.getElementById("new-popup").style.display = "none";
            });
}

if (!isMobileDevice()) {

jmpBtn.addEventListener('mouseover', function() {
    
    document.getElementById("jump-img").style.marginLeft = "50x";
    jmpBtn.innerHTML = "Jump to Top <img src='jump-button.png' alt='Jump' id='jump-img'>";
    jmpBtn.style.width = "auto";
});
 
jmpBtn.addEventListener('mouseout', function() {
    jmpBtn.innerHTML = "<img src='jump-button.png' alt='Jump' id='jump-img'>";
});

} else {

    document.getElementById("nav-list").innerHTML = `
    <li><a href="#" onclick="event.preventDefault(); scrollToSection(1)">ABOUT ME</a></li>
    <li><a href="#" onclick="event.preventDefault(); scrollToSection(2)">PROJECTS</a></li>
    <li><a href="#" onclick="event.preventDefault(); scrollToSection(3)">CONTACT</a></li>   
    `
    document.getElementById("am-title-wrapper").innerHTML = `
    <img src="line.png" id="line">
    <h1 class="section-heading" id="intro-heading">Hey there,<br> I'm Marc!
    </h1>
    `

    document.getElementById("projects").innerHTML = `
    <div class="proj-heading-wrapper">
    <h1 class="section-heading">MY PROJECTS</h1>
    </div>
    <div class="projects-wrapper">
    <div class="mobile-proj">
        <img src="icons.gif" alt="Projects">
        <div class="info">
            <h3>Iconsets: Nature</h3>
        </div>
    </div>
    <div class="mobile-proj">
        <img src="fungames.gif" alt="Projects">
        <div class="info">
            <h3>Logo Animation: FunGames</h3>
        </div>
    </div>
    <div class="mobile-proj">
        <img src="mealbox.gif" alt="Projects">
        <div class="info">
            <h3>UI Concept: MealBox</h3>
        </div>
    </div>
    <div class="mobile-proj">
        <img src="loading.gif" id="loadingGif" alt="Projects">
        <div class="info">
            <h3>Loading Animation: THI</h3>
        </div>
    </div>
    <div class="mobile-proj">
        <img src="zgk-logo.png" alt="Projects">
        <div class="info">
            <h3>Logo: ZGK</h3>
        </div>
    </div>
    <div class="mobile-proj">
        <img src="taddle.gif" alt="Projects">
        <div class="info">
            <h3>UI Concept: taddle</h3>
        </div>
    </div>
    </div>
    `

}
