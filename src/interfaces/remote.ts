interface IRemote {
    port?: number;
    host: string;
    entries: Array<{ host?: string; version: number; name: string }>;
}

export default IRemote;
