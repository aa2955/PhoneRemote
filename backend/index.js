const express = require('express');
const router = express.Router();
const qrcode = require('qrcode');
const os = require('os');

// Function to get the local IP address
function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const iface in interfaces) {
        for (const alias of interfaces[iface]) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

router.get('/qr', async (req, res) => {
    try {
        const localIp = getLocalIpAddress();
        const qrData = `http://${localIp}:4000`;
        const qrCode = await qrcode.toDataURL(qrData);
        res.send(`<img src="${qrCode}" />`);
    } catch (err) {
        res.status(500).send('Error generating QR code');
    }
});

module.exports = router;
