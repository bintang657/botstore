// File: api/webhook.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Hanya menerima POST' });

    const donasi = req.body;
    
    // Konfigurasi Utama
    const BOT_TOKEN = '8515558602:AAEXz6mg9rbA00uow9pK8f8VA29REIKq-Mw'; // Ganti dengan token bot Anda
    const ADMIN_ID = '5552266500';

    // Katalog beserta File/Link produknya (Vercel yang pegang barangnya)
    const produkBarang = {
        150000: { nama: 'Script Web Premium', file: 'Ini link Script Web: https://link.com/1' },
        50000: { nama: 'Tools Free Fire VIP', file: 'Ini file Tools FF VIP: https://link.com/2' },
        75000: { nama: 'SC Bot Telegram', file: 'Ini SC Bot Tele: https://link.com/3' }
    };

    if (donasi && donasi.amount && donasi.message) {
        const uangMasuk = parseInt(donasi.amount);
        const extractId = donasi.message.match(/\d+/);

        if (extractId) {
            const idPembeli = extractId[0];
            const produkDibeli = produkBarang[uangMasuk];

            if (produkDibeli) {
                // 1. Kirim File/Barang ke Pembeli
                await kirimTele(BOT_TOKEN, idPembeli, `✅ <b>PEMBAYARAN BERHASIL!</b>\n\nTerima kasih membeli <b>${produkDibeli.nama}</b>.\n\n📦 <b>Pesanan Anda:</b>\n${produkDibeli.file}`);
                
                // 2. Kirim perintah rahasia ke Admin agar Bot Pterodactyl mengupdate Database
                await kirimTele(BOT_TOKEN, ADMIN_ID, `/sukses_bayar ${idPembeli} ${uangMasuk}`);
                
            } else {
                // Uang masuk tapi nominal salah
                await kirimTele(BOT_TOKEN, idPembeli, `⚠️ <b>Dana Masuk (Rp ${uangMasuk})</b>\n\nNominal tidak sesuai katalog. Hubungi Admin.`);
            }
        }
    }

    return res.status(200).send('OK');
}

// Fungsi ringan menembak API Telegram langsung
async function kirimTele(token, chatId, text) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'HTML' })
    }).catch(err => console.error(err));
}
