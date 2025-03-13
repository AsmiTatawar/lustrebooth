const video = document.getElementById("video");
const captureButton = document.getElementById("capture");
const photoStripCanvas = document.getElementById("photo-strip");
const ctx = photoStripCanvas.getContext("2d");

const bgColorPicker = document.getElementById("bg-color");
const downloadButton = document.getElementById("download");
const filterToggle = document.getElementById("filter-toggle");

const layoutButtons = document.querySelectorAll(".layout-buttons button");

const LAYOUTS = {
    1: { rows: 1, cols: 1 },
    2: { rows: 2, cols: 1 },
    3: { rows: 3, cols: 1 },
    4: { rows: 2, cols: 2 }
};

let selectedLayout = 3;
let images = [];
let isBlackAndWhite = false;

// Access Webcam
navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
    .then(stream => { video.srcObject = stream; })
    .catch(err => console.error("Error accessing webcam:", err));

// Capture Photo
captureButton.addEventListener("click", () => {
    if (images.length < selectedLayout) {
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        tempCtx.save();
        tempCtx.translate(tempCanvas.width, 0); // Move the context
        tempCtx.scale(-1, 1); // Flip it back to normal
        tempCtx.drawImage(video, 0, 0,tempCanvas.width,tempCanvas.height);
        tempCtx.restore();
        images.push(tempCanvas);
        updatePhotoStrip();
    } else {
        alert(`You've already captured ${selectedLayout} photos!`);
    }
});

// Update Photo Strip
function updatePhotoStrip() {
    const { rows, cols } = LAYOUTS[selectedLayout];
    const PHOTO_WIDTH = 250;
    const PHOTO_HEIGHT = 200;
    const PADDING = 10;

    photoStripCanvas.width = cols * (PHOTO_WIDTH + PADDING) + PADDING;
    photoStripCanvas.height = rows * (PHOTO_HEIGHT + PADDING) + PADDING;

    ctx.fillStyle = bgColorPicker.value || "white";
    ctx.fillRect(0, 0, photoStripCanvas.width, photoStripCanvas.height);

    images.forEach((img, index) => {
        const x = PADDING + (index % cols) * (PHOTO_WIDTH + PADDING);
        const y = PADDING + Math.floor(index / cols) * (PHOTO_HEIGHT + PADDING);

        if (isBlackAndWhite) {
            ctx.filter = "grayscale(100%)";
        } else {
            ctx.filter = "none";
        }
        ctx.drawImage(img, x, y, PHOTO_WIDTH, PHOTO_HEIGHT);
    });

    addWatermark();
}

// Add Watermark
function addWatermark() {
    ctx.font = "italic 24px 'Playfair Display', cursive";
    ctx.fillStyle = "gold";
    ctx.textAlign = "center";
    ctx.fillText("Lustré Photobooth", photoStripCanvas.width / 2, photoStripCanvas.height - 15);
}

// Toggle B&W Filter
filterToggle.addEventListener("change", () => {
    isBlackAndWhite = filterToggle.checked;
    updatePhotoStrip();
});

// Change Layout
layoutButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedLayout = parseInt(button.dataset.layout);
        images = [];
        updatePhotoStrip();
    });
});

// Download Photo Strip
downloadButton.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "photo_strip.png";
    link.href = photoStripCanvas.toDataURL("image/png");
    link.click();
});
