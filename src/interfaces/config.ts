export interface IExpose {
    minify?: boolean;
    sourcemap?: boolean;
    entries: Array<{ version: number; name: string; target: string; deps: Array<string> }>;
}

export interface IRemote {
    host: string;
    entries: Array<{ host?: string; version: number; name: string }>;
}

export interface IConfig {
    platform: 'browser' | 'node';
    zipPass?: string;
    expose?: IExpose;
    remote?: IRemote;
}
