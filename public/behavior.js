// Logo Name
const screenWidth = window.innerWidth;
const logos = document.querySelectorAll(".logo_name");

// changeLogo();

function changeLogo() {
    const screenWidth = window.innerWidth;
    if(screenWidth <= 700) {
        for(i=0; i<logos.length; i++) {
            logos[i].textContent = "FV";
        }
    } else {
        for(i=0; i<logos.length; i++) {
            logos[i].textContent = "FoodVerse";
        }
    }
}

// window.addEventListener("resize", changeLogo);

// // Rotating Hero Image
// const bgImg = ['/images/breakfast.jpg)', '/images/lunch.jpg)', '/images/dinner.jpg)'];

// function imgRevolve() {
//     for(i=0; i<bgImg.length; i++) {
//         document.getElementById("hero").style.backgroundImage = 'url(' + bgImg[i] + ')';
//     }

//     setInterval(function() {
//     }, 2000);
// }