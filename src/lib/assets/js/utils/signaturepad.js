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
        this.isDrawing = true;
        const position = this.getPosition(e);
        this.lastX = position.x;
        this.lastY = position.y;
    }

    stopDrawing() {
        this.isDrawing = false;
        this.ctx.beginPath(); // Reset path
    }

    draw(e) {
        if (!this.isDrawing) return;

        const position = this.getPosition(e);

        // Calligraphy pen settings
        const nibWidth = 1; // Thickness of the nib
        const nibAngle = Math.PI / 6; // 30 degrees angle

        // Calculate the nib's offset based on angle
        const dx = nibWidth * Math.cos(nibAngle);
        const dy = nibWidth * Math.sin(nibAngle);

        this.ctx.lineWidth = 1; // The actual line width can remain small for precision
        this.ctx.strokeStyle = '#000'; // Pen color

        // Draw using the calligraphy nib effect
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX - dx, this.lastY - dy);
        this.ctx.lineTo(position.x - dx, position.y - dy);
        this.ctx.lineTo(position.x + dx, position.y + dy);
        this.ctx.lineTo(this.lastX + dx, this.lastY + dy);
        this.ctx.closePath();
        this.ctx.fill(); // Fill the nib stroke

        // Update the last position
        this.lastX = position.x;
        this.lastY = position.y;
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
        e.preventDefault(); // Prevent scrolling
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
            const file = new File([blob], (filename + '.png'), { type: "image/png" });
            resolve(file);
        }, "image/png");
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
}

export default SignPad;
