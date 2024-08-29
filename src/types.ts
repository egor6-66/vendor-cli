export interface IExposes {
    minify?: boolean;
    sourcemap?: boolean;
    entries: Array<{ version: number; name: string; target: string; deps: Array<string> }>;
}

export interface IRemotes {
    host: string;
    name: string;
    entries: Array<{ host?: string; version: number; name: string }>;
}

export interface IConfig {
    platform: 'browser' | 'node';
    zipPass?: string;
    exposes?: IExposes;
    remotes?: IRemotes;
}
