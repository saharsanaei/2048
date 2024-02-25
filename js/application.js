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

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});