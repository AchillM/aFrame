Photobooth FaaStore — Pink Glam Sparkle
======================================

Isi paket:
- index.html
- style.css
- script.js
- README.md

Fitur utama:
- Tema Pink Glam Sparkle
- 5 built-in glamour SVG overlays (ringan)
- Upload custom frame PNG (transparan)
- Soft-beauty filter toggle
- Switch camera (front/back)
- Ambil foto dan download hasil

Cara pakai lokal:
1. Ekstrak zip.
2. Buka index.html di browser modern (Chrome, Edge, Firefox, Safari).
   - Untuk kamera di file:// di beberapa browser perlu dijalankan lewat server lokal.
   - Jika kamera tidak aktif, jalankan server lokal: `python -m http.server 8000` lalu buka http://localhost:8000
3. Pilih frame, atau upload PNG frame (transparent), lalu klik "Ambil Foto".
4. Download hasil.

Hosting:
- Upload folder ke GitHub Pages atau Netlify untuk host gratis.

Catatan:
- SVG overlay akan di-stretch untuk menutup area foto; untuk frame dengan proporsi khusus, gunakan PNG frame transparan dengan resolusi yang cocok.
- QR "download" membuka foto dalam tab baru (offline). Untuk QR sebenarnya yang memuat link, perlu hosting hasil lalu generate QR dari URL.

Kamu mau aku tambahkan:
- Zip berisi contoh PNG frame glitter (saat ini placeholder SVG digunakan), atau
- Otomatis generate QR dengan hosting hasil (aku bisa siapkan endpoint sederhana jika kamu punya tempat host).
