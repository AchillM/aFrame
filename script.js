
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let currentStream = null;
let usingFrontCamera = true;
let lastImage = null;

// Kamera
async function startCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  const constraints = {
    video: {
      facingMode: usingFrontCamera ? 'user' : 'environment'
    }
  };
  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;
  } catch (err) {
    alert('Camera access denied or not supported.');
  }
}

document.getElementById('switchCamera').addEventListener('click', () => {
  usingFrontCamera = !usingFrontCamera;
  startCamera();
});

// Ambil Foto
document.getElementById('capture').addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  lastImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Flash effect
  let flash = document.querySelector('.flash');
  flash.style.opacity = 1;
  setTimeout(() => flash.style.opacity = 0, 100);

  applyFrame();
  applySticker();
  applyFilter();
});

// Undo
document.getElementById('undo').addEventListener('click', () => {
  if(lastImage) ctx.putImageData(lastImage, 0, 0);
});

// Reset
document.getElementById('reset').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lastImage = null;
  document.getElementById('filter').value = 'none';
  document.getElementById('frameSelect').value = '';
  document.getElementById('stickerSelect').value = '';
});

// Download
document.getElementById('download').addEventListener('click', () => {
  let link = document.createElement('a');
  link.download = 'photobooth.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Filter
document.getElementById('filter').addEventListener('change', () => {
  applyFilter();
});

function applyFilter() {
  let filter = document.getElementById('filter').value;
  canvas.style.filter = filter;
}

// Frame
document.getElementById('frameSelect').addEventListener('change', applyFrame);
document.getElementById('customFrame').addEventListener('change', (e) => {
  let file = e.target.files[0];
  if(file){
    let img = new Image();
    img.onload = () => {
      canvas.ctxFrame = img;
      applyFrame();
    };
    img.src = URL.createObjectURL(file);
  }
});

function applyFrame() {
  let frameSrc = document.getElementById('frameSelect').value;
  if(frameSrc || canvas.ctxFrame){
    let img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.src = canvas.ctxFrame?.src || frameSrc;
  }
}

// Sticker
document.getElementById('stickerSelect').addEventListener('change', applySticker);
document.getElementById('customSticker').addEventListener('change', (e) => {
  let file = e.target.files[0];
  if(file){
    let img = new Image();
    img.onload = () => {
      canvas.ctxSticker = img;
      applySticker();
    };
    img.src = URL.createObjectURL(file);
  }
});

function applySticker() {
  if(canvas.ctxSticker){
    ctx.drawImage(canvas.ctxSticker, 50, 50, 100, 100);
  } else {
    let stickerSrc = document.getElementById('stickerSelect').value;
    if(stickerSrc){
      let img = new Image();
      img.onload = () => ctx.drawImage(img, 50, 50, 100, 100);
      img.src = stickerSrc;
    }
  }
}

// Dark Mode
document.getElementById('darkMode').addEventListener('change', (e) => {
  document.body.classList.toggle('dark-mode', e.target.checked);
});

startCamera();
