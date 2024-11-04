// leaderboard.js

// Initialize meme scores
let memeScores = JSON.parse(localStorage.getItem('memeScores')) || {};

// Display top 10 memes
function displayTop10() {
    const top10Container = document.getElementById('top-10-container');
    top10Container.innerHTML = '';
    const sortedMemes = Object.keys(memeScores).sort((a, b) => memeScores[b] - memeScores[a]);
    sortedMemes.slice(0, 10).forEach((memeId, index) => {
        const memeScore = memeScores[memeId];
        const memeEntry = document.createElement('a');
        memeEntry.className = 'leaderboard-card';
        memeEntry.href = `https://www.reddit.com/r/${memeId.split('_')[0]}/comments/${memeId.split('_')[1]}`;
        memeEntry.target = '_blank';
        if (index === 0) {
            memeEntry.classList.add('gold');
        } else if (index === 1) {
            memeEntry.classList.add('silver');
        } else if (index === 2) {
            memeEntry.classList.add('bronze');
        }
        memeEntry.innerHTML = `
            <p>${index + 1}. Meme - ${memeScore} votes</p>
        `;
        top10Container.appendChild(memeEntry);
    });
}

// Initial display of top 10 memes
displayTop10();