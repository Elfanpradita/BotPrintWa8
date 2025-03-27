# 🤖 WhatsApp Auto Print Bot 🖨️

Bot WhatsApp ini secara otomatis mencetak gambar dan PDF yang dikirim ke WA menggunakan printer jaringan yang terhubung ke server CUPS.

## ✨ Fitur

- 🖨️ **Auto Print**: Mencetak gambar dan PDF yang dikirim ke bot WA secara otomatis.
- 🏗️ **Kompatibilitas Lintas Platform**: Dapat dijalankan di Docker pada macOS dan Ubuntu Server.
- ⚡ **Mudah Digunakan**: Instalasi cepat dengan Docker.

## 🔧 Persyaratan

- 🐳 **Docker & Docker Compose** harus terinstal.
- 🖥️ **Server Printer CUPS** harus dikonfigurasi dan dapat diakses dari jaringan.
- 📱 **WhatsApp Account** untuk dihubungkan dengan bot.

## 🚀 Instalasi

1. 📥 Clone repository ini:
   ```sh
   git clone https://github.com/Elfanpradita/BotPrintWa8.git
   cd BotPrintWa8
   ```
2. ⚙️ Sesuaikan konfigurasi IP server printer CUPS di file konfigurasi yang sesuai.
3. 🔨 Bangun dan jalankan container Docker:
   ```sh
   docker compose up -d --build
   ```
4. 📸 Scan barcode yang muncul untuk menghubungkan akun WhatsApp.
5. 📩 Kirim gambar atau PDF ke bot WhatsApp, dan dokumen akan dicetak secara otomatis.

## ⚠️ Catatan

- ❌ **Tidak mendukung WSL**, hanya dapat dijalankan pada macOS & Ubuntu Server dengan Docker.
- 🔗 Pastikan printer dapat diakses dari jaringan dengan server CUPS yang dikonfigurasi dengan benar.

Terima kasih! Semoga bermanfaat. 🚀🔥