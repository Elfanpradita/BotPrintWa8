const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, downloadMediaMessage } = require("@whiskeysockets/baileys");
const { existsSync, mkdirSync, writeFileSync } = require("fs");
const { join } = require("path");
const qrcode = require("qrcode-terminal");
const { printFile } = require("./print");
const config = require("./config");

if (!existsSync(config.printDir)) mkdirSync(config.printDir);

async function startBot() {
    console.log("🚀 Memulai bot...");

    // Gunakan folder auth untuk menyimpan sesi login
    const { state, saveCreds } = await useMultiFileAuthState("./auth");
    const sock = makeWASocket({ auth: state });

    // Simpan sesi login
    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { qr, connection, lastDisconnect } = update;

        if (qr) {
            console.log("📲 Scan QR Code berikut untuk login:");
            qrcode.generate(qr, { small: true });
        }

        if (connection === "open") {
            console.log("✅ Bot terhubung ke WhatsApp!");
        } else if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;
            console.log(`❌ Koneksi terputus. Alasan: ${reason}`);
            console.log("🔄 Restarting bot...");
            startBot();
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const sender = msg.key.remoteJid;
        const msgType = Object.keys(msg.message)[0];

        // ✅ Fitur Ping-Pong
        if (msgType === "conversation" || msgType === "extendedTextMessage") {
            const text = msg.message.conversation || msg.message.extendedTextMessage.text;
            
            if (text.toLowerCase() === "ping") {
                sock.sendMessage(sender, { text: "Pong! 🏓" });
                return;
            }
        }

        // ✅ Print File (PDF/Gambar)
        if (msgType === "imageMessage" || msgType === "documentMessage") {
            try {
                console.log(`📥 Menerima file dari ${sender}...`);
                
                const buffer = await downloadMediaMessage(msg, "buffer", {});
                if (!buffer) throw new Error("Gagal mengunduh media");

                const fileName = msgType === "imageMessage"
                    ? `image_${Date.now()}.jpg`
                    : msg.message.documentMessage.fileName || `file_${Date.now()}.pdf`;

                const filePath = join(config.printDir, fileName);
                writeFileSync(filePath, buffer);
                console.log(`✅ File berhasil disimpan: ${filePath}`);

                // Cetak dokumen dan kirim notifikasi ke user
                printFile(filePath, config.printerName)
                    .then(() => {
                        sock.sendMessage(sender, { text: `✅ Dokumen berhasil dicetak: ${fileName}` });
                    })
                    .catch((err) => {
                        sock.sendMessage(sender, { text: `❌ Gagal mencetak dokumen: ${err.message}` });
                    });
            } catch (error) {
                console.error("❌ Gagal memproses file:", error);
                sock.sendMessage(sender, { text: "❌ Terjadi kesalahan saat memproses file." });
            }
        }
    });

    return sock;
}

startBot();
