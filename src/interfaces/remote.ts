interface IEntry {
    url?: string;
    watch?: boolean;
    version: number;
    name: string;
}

interface IRemote {
    url: string;
    watch?: boolean;
    entries: Array<IEntry>;
}

export default IRemote;
