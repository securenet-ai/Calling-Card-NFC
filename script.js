const downloadBtn = document.getElementById('downloadBtn');
const callingCardImage = document.getElementById('callingCardImage');

downloadBtn.addEventListener('click', async () => {
    try {
        // Get the image source
        const imageUrl = callingCardImage.src;

        // Fetch the image
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'calling-card.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to download image. Please try again.');
    }
});