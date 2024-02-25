async function sentRequest(url) {
  let controller = new AbortController();
  let fetchAbort = setTimeout(() => controller.abort(), 9000);

  const response = await fetch(url, { signal: controller.signal});
  if (response.ok) {
    clearTimeout(fetchAbort);
    const apiResult = await response.json();
    return apiResult;
  } else {
    console.log("API faced to an error");
  }
}

const unsplashAccessKey = "NenwZ4FcykicfNfMmnB5dZjYXRMWls9KQM0ldJHjxso";

const query = "desert, mountains";

fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${unsplashAccessKey}`)
  .then((response) => response.json())
  .then((data) => {
    const imageUrl = data.urls.regular;

    document.body.style.backgroundImage = `url('${imageUrl}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
  })
  .catch((error) => console.error("Error fetching random image:", error));

  document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('name-form');
    const playerNameInput = document.getElementById('player-name');

    // Check if username exists in localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        playerNameInput.value = storedUsername;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = playerNameInput.value;

        // Check if username exists, if so, reset bestScore to 0
        const storedBestScore = localStorage.getItem('bestScore');
        if (storedBestScore !== null) {
            localStorage.setItem('bestScore', 0);
        }

        localStorage.setItem('username', username);

        const newUrl = `game.html?username=${encodeURIComponent(username)}`;
        window.location.href = newUrl;
    });
});

