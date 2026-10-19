// src/lib/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let WebSocket = null;

if (typeof window !== 'undefined') {
    window.Pusher = Pusher;

    WebSocket = new Echo({
        broadcaster: 'reverb',
        key: 'm7ykw4i6apawcihepzck', // Must match REVERB_APP_KEY in your Laravel .env
        wsHost: 'localhost',
        wsPort: 8085,
        wssPort: 8085,
        forceTLS: false,
        enabledTransports: ['ws', 'wss'],
    });
}

export default WebSocket;
