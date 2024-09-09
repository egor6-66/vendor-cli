import { WebSocketServer } from 'ws';

interface IWsServer {
    sendToClient: (event: string, data: object) => void;
}

class Ws {
    private ws!: WebSocket;

    createServer(wsPort): IWsServer {
        const wss = new WebSocketServer({
            port: wsPort,
            perMessageDeflate: {
                zlibDeflateOptions: {
                    chunkSize: 1024,
                    memLevel: 7,
                    level: 3,
                },
                zlibInflateOptions: {
                    chunkSize: 10 * 1024,
                },
                clientNoContextTakeover: true,
                serverNoContextTakeover: true,
                serverMaxWindowBits: 10,
                concurrencyLimit: 10,
                threshold: 1024,
            },
        });

        wss.on('connection', (ws: WebSocket) => {
            this.ws = ws;
        });

        const sendToClient = (event, data) => {
            wss.clients.forEach((client) => {
                client.send(JSON.stringify({ event, data }));
            });
        };

        return { sendToClient };
    }
}

export type { IWsServer };
export default new Ws();
