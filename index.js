const fs = require('fs');

// Replace this with your Base64-encoded session ID
const base64SessionId = '';

// Decode the Base64 string
const sessionJson = Buffer.from(base64SessionId, 'base64').toString('utf-8');

// Save the decoded JSON to creds.json
fs.writeFileSync('creds.json', sessionJson, 'utf-8');

console.log('creds.json file created successfully');

const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const { Boom } = require('@hapi/boom');
const { join } = require('path');
const P = require('pino');

// Use the saved creds.json file for authentication
const { state, saveState } = useSingleFileAuthState(join(__dirname, 'creds.json'));

const startSock = () => {
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false, // No need to print QR code since we are using saved credentials
        auth: state,
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                startSock();
            }
        } else if (connection === 'open') {
            console.log('opened connection');
        }
    });

    sock.ev.on('creds.update', saveState);

    sock.ev.on('messages.upsert', async (m) => {
        console.log(JSON.stringify(m, undefined, 2));

        const msg = m.messages[0];
        if (!msg.key.fromMe && m.type === 'notify') {
            if (msg.message?.conversation) {
                const incomingText = msg.message.conversation;
                const replyText = `You said: ${incomingText}`;
                await sock.sendMessage(msg.key.remoteJid, { text: replyText });
            }
        }
    });

    return sock;
};

startSock();
