// Get card ID from URL hash (the part after #)
const cardId = window.location.hash.substring(1) || 'default';

// Map of card IDs to image paths
const cardImages = {
    'agnes': 'img/agnes-img.png',
    'AttyJohnDerekPorciuncula': 'img/atty1-img.png',
    'john-doe': 'img/atty-img.png',
    'default': 'img/atty-img.png'
};

const callingCardImage = document.getElementById('callingCardImage');

// Set the image based on URL hash
callingCardImage.src = cardImages[cardId] || cardImages['default'];
