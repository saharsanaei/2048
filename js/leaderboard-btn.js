document.querySelector('button[type="button"]').addEventListener('click', goToLeaderboard);

function goToLeaderboard(event) {
    event.preventDefault();
    window.location.href = 'leaderboard.html';
}
