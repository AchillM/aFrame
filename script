let stream = null;
let useFrontCamera = true;
const video = document.getElementById("camera");
const overlayCanvas = document.getElementById("overlayCanvas");
const ctx = overlayCanvas.getContext("2d");

/* ====== FUNGSI: Start Kamera ====== */
async function startCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop()); 
  }

  const constraints = {
    video: {
      facingMode: { ideal: useFrontCamera ? "user" : "environment" },
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  };

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    await video.play();

    // Sesuaikan canvas setelah video siap
    overlayCanvas.width = video.videoWidth;
    overlayCanvas.height = video.videoHeight;

  } catch (err) {
    console.error("Camera error:", err);
    alert("Kamera gagal dibuka. Cek izin kamera di Chrome.");
  }
}

/* ====== FUNGSI: Ambil Foto ====== */
function takePhoto() {
  const photoCanvas = document.createElement("canvas");
  photoCanvas.width = video.videoWidth;
  photoCanvas.height = video.videoHeight;
  const photoCtx = photoCanvas.getContext("2d");

  // gambar video
  photoCtx.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);

  // gambar overlay (soft beauty, frame, dll)
  photoCtx.drawImage(overlayCanvas, 0, 0, photoCanvas.width, photoCanvas.height);

  const dataUrl = photoCanvas.toDataURL("image/png");
  downloadImage(dataUrl);
}

/* ====== FUNGSI: Soft Beauty ====== */
function applySoftBeauty() {
  ctx.filter = "blur(1.5px) brightness(1.07) contrast(1.05)";
}

/* ====== FUNGSI: Reset Filter ====== */
function resetFilter() {
  ctx.filter = "none";
}

/* ====== FUNGSI: Draw Frame ====== */
function drawFrame(frameImgSrc) {
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    ctx.drawImage(img, 0, 0, overlayCanvas.width, overlayCanvas.height);
  };
  img.src = frameImgSrc;
}

/* ====== FUNGSI: Ganti Camera ====== */
function switchCamera() {
  useFrontCamera = !useFrontCamera;
  startCamera();
}

/* ====== FUNGSI: Download Foto ====== */
function downloadImage(dataUrl) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = "faastore_photobooth.png";
  a.click();
}

/* Start kamera langsung saat halaman buka */
startCamera();
