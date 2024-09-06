interface IEntry {
    port?: number;
    host?: string;
    version: number;
    name: string;
}

interface IRemote {
    port?: number;
    host: string;
    entries: Array<IEntry>;
}

export default IRemote;
