interface IEntries {
    version?: number;
    name: string;
    exposes: Record<string, string>;
    shared?: string[];
}

export interface IDistConfig {
    serverPort?: number;
    entries: Array<IEntries>;
    files: Array<string>;
    folders: Array<string>;
}
