document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;

    // Set canvas background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});
