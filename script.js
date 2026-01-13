// Get card ID from URL hash (the part after #)
const cardId = window.location.hash.substring(1) || 'default';

// Map of card IDs to image paths
const cardImages = {
    'agnesnazarro': 'img/agnes1-img.png',
    'davemajelna': 'img/dave-img.png',
    'paulmacaranas': 'img/paul-img.png',
    'irishevangelista': 'img/irish-img.png',
    'lloydromero': 'img/lloyd-img.png',
    'ashleyalejandro': 'img/ashley-img.png',
    'panjsupapo': 'img/panj-img.png',
    'AttyJohnDerekPorciuncula': 'img/atty3-img.png',
    'john-doe': 'img/atty-img.png',
    'default': 'img/atty1-img.png'
    
};

const downloadBtn = document.getElementById('downloadBtn');
const callingCardImage = document.getElementById('callingCardImage');

// Set the image based on URL hash
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
