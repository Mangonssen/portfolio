const navIcons = document.querySelectorAll('.nav-icon');

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
                console.log("hovered over link");
                console.log(cursor.children[0]);
                cursor.children[0].children[0].src = "resources/pointer.svg";
        });
        links[i].addEventListener('mouseout', function (event) {
                cursor.children[0].children[0].src = "resources/cursor.svg";
        });
}