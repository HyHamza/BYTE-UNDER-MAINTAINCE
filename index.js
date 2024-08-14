const fs = require('fs');

// Replace this with your Base64-encoded session ID
const base64SessionId = 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSUxleFNUTVBIekQ4amtYWUUzNXlxMDZweHdOWlpFN29oV29kd1Z6dUgyYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibEtJVGRQL3BlNFpjelZOMkRRcEpqZ2l0MmZsakExR3J1ZWlPRU1oZ3VoMD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJxS3ZoUUQxVytvL2xtYzJrNjNhMWlVNWU5UTJUVlFxNEMyZzAwY2tzd25JPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJkTXEvZEV2OElaMmdFS21iRFJVWFA2NmRRa1JLRlliZmR6SDdGcHVscDNBPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkFBcHFJT2VUMGY4Rm13bVpOOHdiMzUvUmZRQjZxSFpzZXp3SE95U2ZhRmM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkhGRlE2L0R3ZE1UZzU3U2t1enV0V01TQ3FqMHBLaHgzNnlsT0d4U0FVbmc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZURjemN6dWVodWVKVDFHQWJGNzFKdTY0dHVxSmVyRDlOdGJNU1Vna3lsMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiL04vcUVBK3J0akV5VTQ0NUcyQStXYjdhcEVXV2d3MFpKcFZEdnhNMWRCcz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InBMZmVFcnJnZXBTeTYxR0I5MjRSZjFMU1plRkRCU21vbU9tUTRjb2twU2JPOHR2cWlUWG9jRGlUNDdqcUZmRGJjcmF4U2FZdDNpU2dyVkpONHJZRWpBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjM0LCJhZHZTZWNyZXRLZXkiOiJlcktLS3V1Z0ZJQklPU1A1T0xmUkhLMW9DRklwYmZkbHo4bHU4d2xoUFNVPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiI1MzE2NkFrWlE3T2F2TXUzNXpKMVNBIiwicGhvbmVJZCI6ImY5ZWE4MTAwLTMzNGEtNGJmOS1hNWUzLWExZWQ0YzY4NDA1NiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIrR3ZnSE42TVdBOVFlZkFRYVZTR2IzeVptcFE9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic3N0eWdKNWVsR1ZCdG9JWkhHckVvQnJvZEM0PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjIyNkFDNEpDIiwibWUiOnsiaWQiOiI5MjM0NTM4MDAzODA6MjBAcy53aGF0c2FwcC5uZXQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ051aDg2a0VFSlhWOGJVR0dBUWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IjRXazZzQm90ZjJjSGsrWFdQZVVBeGNTc25yUjgrbHk5R3NNM1JQZi9vajA9IiwiYWNjb3VudFNpZ25hdHVyZSI6Imk5N1ZZaHNGRE80MmZjUnBUcUpnZ1RyN2FtbTZmRmJJejNCL2Y2K01JZ1ZBMGFXRFV1cjdTM29UOE5vb2lSR1FkTFVxTDlqaGQwVXkwaTFGYVpVVkFBPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJmcS90MFYxTTJNb1ZWRXBOZzRwMGszV0pDWWV0RSt4aWhKWkVENjgxMDhxaTl5RVBwcy94aEU0disrQmYzVGk3QTQwV2F6ZWl1Q1NoakJrU2w1U2Rndz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkyMzQ1MzgwMDM4MDoyMEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJlRnBPckFhTFg5bkI1UGwxajNsQU1YRXJKNjBmUHBjdlJyRE4wVDMvNkk5In19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzIzNjI0MDk4fQ==';

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
