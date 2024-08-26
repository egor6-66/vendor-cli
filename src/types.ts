interface IEntries {
    version?: number;
    name: string;
    exposes: Record<string, string>;
    shared?: string[];
}

export interface IDistConfig {
    type: 'distributor';
    entries: Array<IEntries>;
    files: Array<string>;
    folders: Array<string>;
}

export interface IClientConfig {
    type: 'client';
    remotes: Record<string, string>;
}
