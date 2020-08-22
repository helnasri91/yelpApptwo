// Search Bar
const screenWidth = window.innerWidth;
const navBarBtn = document.querySelectorAll("#navBar i");
const searchBar = document.getElementById("searchBar");
const bod = document.querySelector("main");
const suggestions = document.getElementById("suggestions");

navBarBtn[0].addEventListener("click", expandSearch);
bod.addEventListener("click", hideSearch);
suggestions.addEventListener("click", hideSearch);

function expandSearch() {
    searchBar.style.display = "block";
    if(screenWidth <= 450) {
        navBarBtn[0].style.display = "none";
        navBarBtn[1].style.display = "none";
    } 
}
function hideSearch() {
    searchBar.style.display = "none";
    navBarBtn[0].style.display = "block";
    navBarBtn[1].style.display = "block";
}

// Share Button
const suggShare = document.querySelectorAll(".suggBtnShare");
for(i=0;i<suggShare.length;i++) {
    suggShare[i].addEventListener("click", webCam);
}
function webCam() {
    confirm("FoodVerse would like to access your camera. Click OK to continue.");
}

// Show Suggestions
const mainBod = document.querySelectorAll("main");
const socialBtn = document.getElementById("socialBtn");

socialBtn.addEventListener("click", showSugg);

function showSugg() {
    if(suggestions.style.display == "none") {
        for(i=0;i<mainBod.length;i++) {
            mainBod[i].style.display = "none";
        }
        suggestions.style.display = "block";
        socialBtn.classList = "fas fa-times";
    } else {
        for(i=0;i<mainBod.length;i++) {
            mainBod[i].style.display = "block";
        }
        suggestions.style.display = "none";
        socialBtn.classList = "fas fa-users";
    }
}