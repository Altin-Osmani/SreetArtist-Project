

// DOM Elements
const barsBtn = document.querySelectorAll(".bars-button");
const allDropdowns = document.querySelectorAll(".dropdown-nav");

// funksioni per hapjen e dropDownNav
const toggleDropdown = (dropdownNav) => {
    dropdownNav.classList.toggle("active");
};

// funksioni per mbylljen e dropDownNav
const hideDropdown = (dropdownNav) => {
    dropdownNav.classList.remove("active");
};

// Event listener for bars buttons
barsBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        const dropdownNav = btn.parentElement.nextElementSibling;
        toggleDropdown(dropdownNav);
    });
});

// Event listener for dropdowns
allDropdowns.forEach(dropD => {
    dropD.addEventListener("click", () => {
        hideDropdown(dropD);
    });
});

// Function to render navigation name
const renderNavName = () => {
    const artistName = localStorage.getItem("artist");
    const navTitles = document.querySelectorAll(".logo-title .artist-name");

    if (artistName) {
        navTitles.forEach(title => title.textContent = artistName);
    } else {
        location.hash = "";
    }
};

// Call renderNavName on DOMContentLoaded
document.addEventListener("DOMContentLoaded", renderNavName);
