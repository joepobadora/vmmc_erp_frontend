class SignPad {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');

        // Set default canvas size
        // this.canvas.width = 500;
        // this.canvas.height = 200;

        // Variables to track drawing
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;

        // Bind event listeners to maintain proper `this` context
        this.startDrawing = this.startDrawing.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
        this.draw = this.draw.bind(this);
        this.lockScroll = this.lockScroll.bind(this);

        // Add event listeners for mouse and touch events
        this.addEventListeners();

        // Pause mechanism
        this.Pause = this.Pause.bind(this);
        this.Resume = this.Resume.bind(this);
        this.isPaused = false;
        this.TogglePause = this.TogglePause.bind(this);
    }

    addEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.startDrawing);
        this.canvas.addEventListener('mousemove', this.draw);
        this.canvas.addEventListener('mouseup', this.stopDrawing);
        this.canvas.addEventListener('mouseout', this.stopDrawing);

        // Touch events
        this.canvas.addEventListener('touchstart', this.startDrawing, {
            passive: false,
        });
        this.canvas.addEventListener('touchmove', this.draw, {
            passive: false,
        });
        this.canvas.addEventListener('touchend', this.stopDrawing);

        // Lock scrolling on the canvas area
        this.canvas.addEventListener('touchstart', this.lockScroll, {
            passive: false,
        });
        this.canvas.addEventListener('touchmove', this.lockScroll, {
            passive: false,
        });
        this.canvas.addEventListener('mousedown', this.lockScroll);
        this.canvas.addEventListener('mousemove', this.lockScroll);
    }

    startDrawing(e) {
        if (this.isPaused) return;

        this.isDrawing = true;
        const position = this.getPosition(e);

        this.lastX = position.x;
        this.lastY = position.y;

        // Initialize midpoints to the start position
        this.lastMidX = position.x;
        this.lastMidY = position.y;
    }

    stopDrawing() {
        this.isDrawing = false;
        this.ctx.beginPath(); // Reset path
    }

    draw(e) {
        if (this.isDrawing === false || this.isPaused) return;

        const position = this.getPosition(e);

        // 1. Calculate the midpoint between the last position and current position
        const midX = (this.lastX + position.x) / 2;
        const midY = (this.lastY + position.y) / 2;

        // 2. Calligraphy Pen Settings
        const nibWidth = 1;
        const nibAngle = Math.PI / 6;
        const dx = nibWidth * Math.cos(nibAngle);
        const dy = nibWidth * Math.sin(nibAngle);

        this.ctx.fillStyle = '#000';

        // 3. Draw the smoothed segment
        // We use a quadraticCurveTo to move from the previous midpoint
        // through the 'last' point, ending at the 'new' midpoint.
        this.ctx.beginPath();

        // Top edge of the nib
        this.ctx.moveTo(this.lastMidX - dx, this.lastMidY - dy);
        this.ctx.quadraticCurveTo(this.lastX - dx, this.lastY - dy, midX - dx, midY - dy);

        // Bottom edge of the nib
        this.ctx.lineTo(midX + dx, midY + dy);
        this.ctx.quadraticCurveTo(this.lastX + dx, this.lastY + dy, this.lastMidX + dx, this.lastMidY + dy);

        this.ctx.closePath();
        this.ctx.fill();

        // 4. Update tracking variables
        this.lastX = position.x;
        this.lastY = position.y;
        this.lastMidX = midX;
        this.lastMidY = midY;
    }

    getPosition(e) {
        const rect = this.canvas.getBoundingClientRect(); // Get canvas position and dimensions
        const scaleX = this.canvas.width / rect.width; // Scale factor for X-axis
        const scaleY = this.canvas.height / rect.height; // Scale factor for Y-axis

        let x, y;

        if (e.touches) {
            // For touch events, use the first touch point
            x = (e.touches[0].clientX - rect.left) * scaleX;
            y = (e.touches[0].clientY - rect.top) * scaleY;
        } else {
            // For mouse events
            x = (e.clientX - rect.left) * scaleX;
            y = (e.clientY - rect.top) * scaleY;
        }

        // Ensure coordinates are within canvas bounds
        x = Math.max(0, Math.min(x, this.canvas.width));
        y = Math.max(0, Math.min(y, this.canvas.height));

        return { x, y };
    }

    lockScroll(e) {
        if (!this.isPaused) {
            e.preventDefault(); // Only lock scroll if we are in "signing mode"
        }
    }

    ClearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    SaveAsBase64() {
        return this.canvas.toDataURL();
    }

    SaveAsPNG(filename) {
        return new Promise((resolve) => {
            this.canvas.toBlob((blob) => {
                const file = new File([blob], filename + '.png', { type: 'image/png' });
                resolve(file);
            }, 'image/png');
        });
    }

    Valid(thresholdPercent = 1) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        let inkedPixels = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            const a = pixels[i + 3]; // alpha channel
            if (a > 0) inkedPixels++;
        }

        const totalPixels = this.canvas.width * this.canvas.height;
        const coverage = (inkedPixels / totalPixels) * 100;

        return coverage >= thresholdPercent;
    }

    // Explicitly stop signing and allow scrolling
    Pause() {
        this.isPaused = true;
        this.updateCanvasUI();
    }

    // Explicitly enable signing and lock scrolling
    Resume() {
        this.isPaused = false;
        this.updateCanvasUI();
    }

    // The toggle helper you already had, now using the explicit methods
    TogglePause() {
        if (this.isPaused) {
            this.Resume();
        } else {
            this.Pause();
        }
        return this.isPaused;
    }

    // Helper to keep the UI logic in one place
    updateCanvasUI() {
        if (this.isPaused) {
            this.canvas.style.cursor = 'default';
            this.canvas.style.touchAction = 'auto';
        } else {
            this.canvas.style.cursor = 'crosshair';
            this.canvas.style.touchAction = 'none';
        }
    }
}

export default SignPad;
