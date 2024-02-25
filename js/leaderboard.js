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

  document.querySelector('button[type="restart"]').addEventListener('click', goToLeaderboard);
  
  function goToLeaderboard(event) {
      event.preventDefault();
      window.location.href = 'index.html';
  }

let username = localStorage.getItem("username");
let score = parseInt(localStorage.getItem("bestScore") || 0); // Parse score as integer
let bestScore = parseInt(localStorage.getItem(username + "_best") || 0); // Parse best score as integer

if (score > bestScore) {
  // Update best score
  localStorage.setItem(username + "_best", score);
}

// Update leaderboard
updateLeaderboard(username, score);

function updateLeaderboard(username, score) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "{}");

  // Update or set the highest score for the user
  leaderboard[username] = Math.max(score, leaderboard[username] || 0);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "{}");

// Display sorted leaderboard
let sortedLeaderboard = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]);

for (let [username, score] of sortedLeaderboard) {
  let row = document.createElement("tr");
  row.innerHTML = `
    <td><img src="https://source.boringavatars.com/beam/40/${username}"></td>
    <td>${username}</td>
    <td>${score}</td>
  `;
  document.getElementById("leaderboard-body").appendChild(row);
}
