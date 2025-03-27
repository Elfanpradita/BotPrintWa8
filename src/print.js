const { exec } = require("child_process");

function detectPrinter() {
  return new Promise((resolve) => {
    exec("lpstat -e", (err, stdout) => {
      if (err) return resolve(null);
      const printers = stdout.trim().split("\n");
      resolve(printers[0] || null);
    });
  });
}

async function printFile(filePath, printerName = "") {
  const printer = printerName || (await detectPrinter());
  if (!printer) return console.error("❌ Tidak ada printer terdeteksi!");

  // Tambahkan tanda kutip di sekitar filePath untuk menangani spasi
  const safeFilePath = `"${filePath}"`;

  exec(`lp -d ${printer} ${safeFilePath}`, (err) => {
    if (err) console.error("❌ Gagal mencetak!", err);
    else console.log(`🖨️ File ${filePath} berhasil dicetak!`);
  });
}

module.exports = { printFile, detectPrinter };
