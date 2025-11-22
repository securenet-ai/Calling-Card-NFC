// Get card ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const cardId = urlParams.get('card') || 'default';

// Map of card IDs to image paths
const cardImages = {
    'porciuncula': 'img/porciuncula-card.png',
    'atty': 'img/atty-img.png',
    'john-doe': 'img/john-doe-card.png',
    'default': 'img/default-card.png'
    // Add more cards here
};

const downloadBtn = document.getElementById('downloadBtn');
const callingCardImage = document.getElementById('callingCardImage');

// Set the image based on URL parameter
callingCardImage.src = cardImages[cardId] || cardImages['default'];

downloadBtn.addEventListener('click', async () => {
    try {
        const imageUrl = callingCardImage.src;
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `calling-card-${cardId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to download image. Please try again.');
    }
});