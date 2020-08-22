// // Logo Name
// const screenWidth = window.innerWidth;
// const logos = document.querySelectorAll(".logo_name");

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

// Share Button


// Modal
const infoBox = document.getElementById("infoBox");
const modalBody = document.getElementById("modalBody");
const shareBtn = document.getElementById("open");

shareBtn.addEventListener("click", toggleShare);

function toggleShare() {
    if(infoBox.style.display === "none") {
        infoBox.style.display = "block";
    } else {
        infoBox.style.display = "none";
    }
    modalBody.innerHTML = "<main id=\"suggestions\"><h3>Let's Eat At...</h3><h4>You suggested:</h4><div class=\"foodListings\"><% for(let i=0; i < suggested.length; i++){  %><div class=\"restaurant\"> <div class=\"restInfo\"><div class=\"restInfoCol\"><div class=\"restImg\"><% if(suggested[i].restaurant.image_url){ %><img src=\"<%= suggested[i].restaurant.image_url %>\"><% } else { %><img src=\"https://images.unsplash.com/photo-1575833947349-69324d765146\"><% } %></div></div><div class=\"restInfoCol\"><p class=\"restName\"><%= suggested[i].restaurant.name %></p><p class=\"restAddress\"><%= suggested[i].restaurant.location.address1 %> <%= suggested[i].restaurant.location.address2 %></p><p class=\"restAddress\"><%= suggested[i].restaurant.location.address3 %></p><p class=\"restAddress\"><%= suggested[i].restaurant.location.city %>, <%= suggested[i].restaurant.location.state %> <%= suggested[i].restaurant.location.zip_code %></p><a href=\"tel:<%= suggested[i].restaurant.phone %>\"><p class=\"restPhone\"><%= suggested[i].restaurant.display_phone %></p></a><div class=\"suggBtn\"><button><i class=\"fas fa-share-alt\"></i> Share</button></div></div></div></div><% } %></div><h4>Your friends suggested:</h4><div class=\"foodListings\"><div class=\"restaurant\"><div class=\"userImg bitmoji\"><img src=\"/images/bitmoji1.png\"></div><div class=\"restInfo\"><div class=\"restInfoCol\"><div class=\"restImg\"><img src=\"https://s3-media2.fl.yelpcdn.com/bphoto/pDWXWLcWzmiCgtAku-QJwQ/o.jpg\"></div></div><div class=\"restInfoCol\"><p class=\"restName\">Vietnoms</p><p class=\"restAddress\">387 S 1st St Ste 121</p><p class=\"restAddress\">San Jose, CA 95113</p><a href=\"tel:+4088275812\"><p class=\"restPhone\">(408) 827-5812</p></a><div class=\"voteBtn\"><button><i class=\"fas fa-arrow-up\"></i> Yea</button><button><i class=\"fas fa-arrow-down\"></i> Nay</button></div></div></div></div><div class=\"restaurant\"><div class=\"userImg bitmoji\"><img src=\"/images/bitmoji2.png\"></div><div class=\"restInfo\"><div class=\"restInfoCol\"><div class=\"restImg\"><img src=\"https://s3-media3.fl.yelpcdn.com/bphoto/3oW4gvYsO83HggYGlqfymw/o.jpg\"></div></div><div class=\"restInfoCol\"><p class=\"restName\">El Torito Azteca</p><p class=\"restAddress\">735 S 1st St</p><p class=\"restAddress\">San Jose, CA 95113</p><a href=\"tel:+4085095274\"><p class=\"restPhone\">(408) 509-5274</p></a><div class=\"voteBtn\"><button><i class=\"fas fa-arrow-up\"></i> Yea</button><button><i class=\"fas fa-arrow-down\"></i> Nay</button></div></div></div></div><div class=\"restaurant\"><div class=\"userImg bitmoji\"><img src=\"/images/bitmoji3.jpeg\"></div><div class=\"restInfo\"><div class=\"restInfoCol\"><div class=\"restImg\"><img src=\"https://s3-media1.fl.yelpcdn.com/bphoto/o7nd8_b7-Wyaa_atTLzb9w/o.jpg\"></div></div><div class=\"restInfoCol\"><p class=\"restName\">iJava Cafe</p><p class=\"restAddress\">387 Delmas Ave</p><p class=\"restAddress\">San Jose, CA 95126</p><a href=\"tel:+4087539732\"><p class=\"restPhone\">(408) 753-9732</p></a><div class=\"voteBtn\"><button><i class=\"fas fa-arrow-up\"></i> Yea</button><button><i class=\"fas fa-arrow-down\"></i> Nay</button></div></div></div></div></div></main>";
}
