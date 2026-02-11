export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Hanya POST' });

    const donasi = req.body;
    
    // ⚠️ SANGAT PENTING: GANTI TULISAN DI BAWAH INI DENGAN TOKEN BOT ANDA!
    const BOT_TOKEN = 'TOKEN_BOT_DARI_BOTFATHER_TARUH_DISINI'; 
    const ADMIN_ID = '5552266500';

    // Katalog Barang Vercel
    const produkBarang = {
        150000: { nama: 'Script Web Premium', file: 'Ini link Script Web: https://link.com/1' },
        50000: { nama: 'Tools Free Fire VIP', file: 'Ini file Tools FF VIP: https://link.com/2' },
        75000: { nama: 'SC Bot Telegram', file: 'Ini SC Bot Tele: https://link.com/3' }
    };

    // PERBAIKAN: Menggunakan amount_raw sesuai standar API Saweria
    if (donasi && donasi.amount_raw && donasi.message) {
        const uangMasuk = parseInt(donasi.amount_raw);
        const extractId = donasi.message.match(/\d+/);

        if (extractId) {
            const idPembeli = extractId[0];
            const produkDibeli = produkBarang[uangMasuk];

            if (produkDibeli) {
                // Kirim barang ke pembeli
                await kirimTele(BOT_TOKEN, idPembeli, `✅ <b>PEMBAYARAN BERHASIL!</b>\n\nTerima kasih membeli <b>${produkDibeli.nama}</b>.\n\n📦 <b>Pesanan Anda:</b>\n${produkDibeli.file}`);
                
                // Beri tahu Pterodactyl untuk update database
                await kirimTele(BOT_TOKEN, ADMIN_ID, `/sukses_bayar ${idPembeli} ${uangMasuk}`);
                
            } else {
                // Uang masuk tapi harga tidak cocok
                await kirimTele(BOT_TOKEN, idPembeli, `⚠️ <b>Dana Masuk (Rp ${uangMasuk})</b>\n\nNominal tidak sesuai katalog. Hubungi Admin.`);
            }
        }
    }

    return res.status(200).send('OK');
}

async function kirimTele(token, chatId, text) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'HTML' })
    }).catch(err => console.error(err));
}
