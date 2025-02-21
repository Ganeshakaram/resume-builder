// Function to redirect to login if not authenticated
function selectTemplate(templateId) {
    const isLoggedIn = sessionStorage.getItem("loggedInUser");

    if (!isLoggedIn) {
        alert("Please log in to use this template!");
        window.location.href = "pages/login.html";
    } else {
        window.location.href = `pages/resume.html?template=${templateId}`;
    }
}

// Function to load different pages dynamically
function loadPage(page) {
    window.location.href = page;
}
