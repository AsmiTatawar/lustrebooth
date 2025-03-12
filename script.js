const video = document.getElementById("video");
const captureButton = document.getElementById("capture");
const photoStripCanvas = document.getElementById("photo-strip");
const ctx = photoStripCanvas.getContext("2d");

const bgColorPicker = document.getElementById("bg-color");
const downloadButton = document.getElementById("download");

const PHOTO_WIDTH = 260;
const PHOTO_HEIGHT = 200;
const PADDING = 20;
const STRIP_WIDTH = 300;
const STRIP_HEIGHT = (PHOTO_HEIGHT + PADDING) * 4 + PADDING;
photoStripCanvas.width = STRIP_WIDTH;
photoStripCanvas.height = STRIP_HEIGHT;

let images = [];

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Error accessing webcam:", err));

captureButton.addEventListener("click", () => {
    if (images.length < 4) {
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

        images.push(tempCanvas);
        updatePhotoStrip();
    } else {
        alert("You've already captured 4 photos!");
    }
});

function updatePhotoStrip() {
    ctx.fillStyle = bgColorPicker.value || "white";
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);
    drawCapturedPhotos();
}

function drawCapturedPhotos() {
    images.forEach((img, index) => {
        ctx.drawImage(img, (STRIP_WIDTH - PHOTO_WIDTH) / 2, PADDING + (index * (PHOTO_HEIGHT + PADDING)), PHOTO_WIDTH, PHOTO_HEIGHT);
    });
}

bgColorPicker.addEventListener("input", updatePhotoStrip);

downloadButton.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "photo_strip.png";
    link.href = photoStripCanvas.toDataURL("image/png");
    link.click();
});

function updatePhotoStrip() {
    ctx.fillStyle = bgColorPicker.value || "white";
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);
    drawCapturedPhotos();
    addWatermark();
}

function addWatermark() {
    ctx.font = "italic 24px 'Playfair Display', cursive";
    ctx.fillStyle = "gold";
    ctx.textAlign = "center";
    ctx.fillText("Lustré Photobooth", STRIP_WIDTH / 2, STRIP_HEIGHT - 15);
}
