// // Logo Name
const screenWidth = window.innerWidth;
const logos = document.querySelectorAll(".logo_name");

// // changeLogo();

// function changeLogo() {
//     const screenWidth = window.innerWidth;
//     if(screenWidth <= 700) {
//         for(i=0; i<logos.length; i++) {
//             logos[i].textContent = "FV";
//         }
//     } else {
//         for(i=0; i<logos.length; i++) {
//             logos[i].textContent = "FoodVerse";
//         }
//     }
// }

// window.addEventListener("resize", changeLogo);

// Search Bar
const navBarBtn = document.querySelectorAll("#navBar i");
const searchBar = document.getElementById("searchBar");
const bod = document.querySelector("main");

navBarBtn[0].addEventListener("click", expandSearch);
bod.addEventListener("click", hideSearch);

function expandSearch() {
    searchBar.style.display = "block";
    if(screenWidth <= 450) {
        navBarBtn[0].style.display = "none";
        navBarBtn[1].style.display = "none";
    } else {

    }
}

function hideSearch() {
    searchBar.style.display = "none";
    navBarBtn[0].style.display = "block";
    navBarBtn[1].style.display = "block";
}