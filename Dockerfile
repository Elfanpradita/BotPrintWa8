# Gunakan base image Debian
FROM node:20-bullseye

# Install dependencies untuk printer
RUN apt-get update && apt-get install -y \
  cups \
  cups-client \
  cups-bsd \
  cups-filters \
  printer-driver-all \
  && rm -rf /var/lib/apt/lists/*

# Pastikan CUPS berjalan
RUN service cups start

# Buat user untuk mengakses CUPS
RUN usermod -aG lpadmin root

# Buat direktori kerja
WORKDIR /app

# Copy file proyek
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Jalankan bot
CMD service cups start && npm start
