// script.js

// Initialize meme scores
let memeScores = JSON.parse(localStorage.getItem('memeScores')) || {};

// Fetch memes from multiple subreddits
async function fetchMemes() {
    const subreddits = ['memes', 'terriblefacebookmemes', 'AdviceAnimals', 'dankmemes', 'teenagers'];
    const allMemes = [];

    for (const subreddit of subreddits) {
        const response = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=20`); // Increase the limit to 50
        const data = await response.json();
        const memes = data.data.children.map(child => child.data);
        allMemes.push(...memes);
    }

    // Filter out memes with broken images
    const validMemes = await Promise.all(allMemes.map(async meme => {
        const isValid = await checkImage(meme.url);
        return isValid ? meme : null;
    }));

    // Remove null values
    const filteredMemes = validMemes.filter(meme => meme !== null);

    // Shuffle the memes array
    const shuffledMemes = filteredMemes.sort(() => 0.5 - Math.random());
    displayMemes(shuffledMemes.slice(0, 2)); // Display only 2 random memes
}

// Check if an image URL is valid
function checkImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Display memes dynamically
function displayMemes(memes) {
    const memeContainer = document.getElementById('meme-container');
    memeContainer.innerHTML = '';
    if (memes.length === 0) {
        memeContainer.innerHTML = '<p>Loading memes...</p>';
    } else {
        memes.forEach((meme, index) => {
            const memeId = `${meme.subreddit}_${meme.id}`;
            if (!memeScores[memeId]) {
                memeScores[memeId] = 0;
            }
            const memeCard = document.createElement('div');
            memeCard.className = 'meme-card';
            memeCard.innerHTML = `
                <div class="meme-image-container">
                    <img src="${meme.url}" alt="Meme ${index + 1}">
                </div>
                <button onclick="voteForMeme('${memeId}')">Vote</button>
            `;
            memeContainer.appendChild(memeCard);
        });
    }
}

// Function to handle voting
function voteForMeme(memeId) {
    memeScores[memeId]++;
    localStorage.setItem('memeScores', JSON.stringify(memeScores));
    console.log(`You voted for Meme ${memeId}! Current score:`, memeScores[memeId]);
    animateButton(memeId);
    displayMemes([]); // Show loading message
    fetchMemes(); // Refresh memes immediately after voting
}

// Animate button
function animateButton(memeId) {
    const button = document.querySelector(`button[onclick="voteForMeme('${memeId}')"]`);
    button.style.backgroundColor = '#28a745';
    setTimeout(() => {
        button.style.backgroundColor = '#007bff';
    }, 300);
}

// Initial fetch of memes
fetchMemes();
