\
/* Photobooth FaaStore - Pink Glam Sparkle
   Features:
   - Multiple built-in frames (SVG overlays)
   - Upload custom PNG frame (transparent)
   - Soft-beauty filter toggle
   - QR download optional (simple: create downloadable data URL and open)
   - Works on mobile and desktop
*/

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const previewFrame = document.getElementById('previewFrame');
const snapBtn = document.getElementById('snapBtn');
const switchBtn = document.getElementById('switchBtn');
const uploadInput = document.getElementById('uploadFrame');
const frameList = document.getElementById('frameList');
const beautyToggle = document.getElementById('beautyToggle');
const qrToggle = document.getElementById('qrToggle');
const resultSection = document.getElementById('resultSection');
const resultImg = document.getElementById('resultImg');
const download = document.getElementById('download');
const qrLink = document.getElementById('qrLink');

let stream = null;
let usingFront = true;
let selectedFrame = null;
const ctx = canvas.getContext('2d');

// Built-in SVG overlays (data URLs). These are lightweight vector overlays that emulate glitter/pink-glam.
// You can add more by pushing data URLs into builtInFrames.
const builtInFrames = [
  {
    name: "Glam Sparkle - Hearts",
    data: `data:image/svg+xml;utf8,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="none">' +
      '<g fill="none" stroke="rgba(255,200,230,0.95)" stroke-width="2">' +
      '<circle cx="90" cy="80" r="6" fill="rgba(255,182,193,0.9)"/>' +
      '<circle cx="720" cy="520" r="10" fill="rgba(255,192,203,0.85)"/>' +
      '</g>' +
      '<g fill="rgba(255,182,193,0.14)">' +
      '<rect x="0" y="0" width="800" height="600" />' +
      '</g>' +
      '<g fill="rgba(255,240,245,0.15)">' +
      '<path d="M650 60c0 40-50 80-50 120s50 80 50 120 50-40 50-80-50-160-50-160z"/>' +
      '</g>' +
      '<g>' +
      '<text x="50%" y="96%" text-anchor="middle" font-size="24" fill="rgba(255,150,200,0.9)" font-family="sans-serif">FaaStore • Pink Glam</text>' +
      '</g>' +
      '</svg>'
    )}`
  },
  {
    name: "Glam Frame - Glitter Border",
    data: `data:image/svg+xml;utf8,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="none">' +
      '<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#ff8fc9"/><stop offset="1" stop-color="#ffd0f2"/></linearGradient></defs>' +
      '<rect x="20" y="20" width="1160" height="760" fill="none" stroke="url(#g)" stroke-width="40" rx="36" ry="36" opacity="0.88"/>' +
      '<g fill="rgba(255,255,255,0.6)">' +
      '<circle cx="80" cy="120" r="4"/>' +
      '<circle cx="200" cy="40" r="3"/>' +
      '<circle cx="1100" cy="700" r="6"/>' +
      '</g>' +
      '</svg>'
    )}`
  },
  {
    name: "Sparkles Overlay",
    data: `data:image/svg+xml;utf8,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="none">' +
      '<g fill="rgba(255,220,240,0.12)">' +
      '<circle cx="50" cy="50" r="8"/>' +
      '<circle cx="200" cy="40" r="5"/>' +
      '<circle cx="400" cy="20" r="4"/>' +
      '<circle cx="650" cy="90" r="6"/>' +
      '<circle cx="720" cy="40" r="3"/>' +
      '</g>' +
      '<g fill="rgba(255,255,255,0.2)">' +
      '<rect x="0" y="0" width="800" height="600" />' +
      '</g>' +
      '</svg>'
    )}`
  },
  {
    name: "Pink Glow Vignette",
    data: `data:image/svg+xml;utf8,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">' +
      '<radialGradient id="rg"><stop offset="0" stop-color="rgba(255,182,193,0.0)"/><stop offset="1" stop-color="rgba(255,20,147,0.32)"/></radialGradient>' +
      '<rect x="0" y="0" width="100" height="100" fill="url(#rg)"/>' +
      '</svg>'
    )}`
  },
  {
    name: "Confetti Sparkle",
    data: `data:image/svg+xml;utf8,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="none">' +
      '<g fill="rgba(255,190,230,0.95)"><rect x="30" y="40" width="6" height="12" rx="2"/><rect x="100" y="90" width="6" height="12" rx="2"/></g>' +
      '<g fill="rgba(255,240,245,0.12)"><rect x="0" y="0" width="800" height="600"/></g>' +
      '</svg>'
    )}`
  }
];

// Populate frame selector
function createFrameItem(frame, idx){
  const el = document.createElement('div');
  el.className = 'frame-item';
  el.title = frame.name;
  const img = document.createElement('img');
  img.src = frame.data;
  img.alt = frame.name;
  el.appendChild(img);
  el.addEventListener('click', ()=>{
    selectBuiltIn(idx);
  });
  frameList.appendChild(el);
}
builtInFrames.forEach((f,i)=>createFrameItem(f,i));

// select built-in frame
function selectBuiltIn(idx){
  selectedFrame = new Image();
  selectedFrame.crossOrigin = "anonymous";
  selectedFrame.src = builtInFrames[idx].data;
  // preview overlay
  previewFrame.src = builtInFrames[idx].data;
  previewFrame.classList.remove('hidden');
  // highlight UI
  document.querySelectorAll('.frame-item').forEach((el, i)=>{
    el.classList.toggle('selected', i===idx);
  });
}

// setup camera
async function startCamera(){
  try{
    if(stream){
      stream.getTracks().forEach(t=>t.stop());
      stream = null;
    }
    const constraints = { video: { facingMode: usingFront ? "user" : "environment" }, audio:false };
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    await video.play();
  }catch(err){
    console.error("Camera error:", err);
    alert("Tidak dapat mengakses kamera. Pastikan permission diberikan.");
  }
}

switchBtn.addEventListener('click', ()=>{
  usingFront = !usingFront;
  startCamera();
});

// handle upload frame
uploadInput.addEventListener('change', (ev)=>{
  const f = ev.target.files[0];
  if(!f) return;
  const url = URL.createObjectURL(f);
  const img = new Image();
  img.onload = ()=>{
    selectedFrame = img;
    previewFrame.src = url;
    previewFrame.classList.remove('hidden');
    // add a small thumbnail to UI
    const thumb = document.createElement('div');
    thumb.className='frame-item';
    const timg = document.createElement('img');
    timg.src = url;
    thumb.appendChild(timg);
    thumb.addEventListener('click', ()=> {
      document.querySelectorAll('.frame-item').forEach(el=>el.classList.remove('selected'));
      thumb.classList.add('selected');
      selectedFrame = img;
      previewFrame.src = url;
    });
    frameList.appendChild(thumb);
  };
  img.src = url;
});

// simple beautify using canvas filter when drawing
function applyBeautyToContext(c){
  // We'll use ctx.filter for simple effects: blur + saturate + contrast
  // Note: filter works on drawImage in many modern browsers
  if(beautyToggle.checked){
    c.filter = 'blur(0.9px) saturate(1.15) contrast(1.05)';
  }else{
    c.filter = 'none';
  }
}

// take snapshot
snapBtn.addEventListener('click', ()=>{
  if(!video.videoWidth || !video.videoHeight){
    alert("Kamera belum siap");
    return;
  }
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // reset any filters
  ctx.save();
  applyBeautyToContext(ctx);
  // mirrored draw (because video is mirrored)
  ctx.translate(canvas.width, 0);
  ctx.scale(-1,1); // flip back so result looks like selfie
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.setTransform(1,0,0,1,0,0); // reset transform
  ctx.filter = 'none';

  // draw selected frame overlay to cover full canvas
  if(selectedFrame){
    try{
      // draw overlay preserving aspect: draw to cover
      ctx.drawImage(selectedFrame, 0, 0, canvas.width, canvas.height);
    }catch(e){
      console.warn('Gagal gambar frame:', e);
    }
  }

  ctx.restore();

  // set result display
  const data = canvas.toDataURL('image/png');
  resultImg.src = data;
  download.href = data;
  resultSection.classList.remove('hidden');

  // If QR requested, open a simple data URL in new tab (not a real QR generator offline)
  if(qrToggle.checked){
    // create a blob and open in new tab so user can scan from another device
    const w = window.open();
    if(w){
      w.document.write('<title>Download Foto — FaaStore</title>');
      w.document.write('<img src="'+data+'" style="max-width:100%;display:block;margin:20px auto;border-radius:8px;" />');
      w.document.close();
      qrLink.href = w.location.href;
      qrLink.textContent = 'Tab QR terbuka';
    }else{
      qrLink.href = data;
      qrLink.textContent = 'Buka Foto';
    }
  }else{
    qrLink.href = '#';
    qrLink.textContent = 'QR nonaktif';
  }
});

// init
startCamera().catch(()=>{});
