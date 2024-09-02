export interface IEsbuildConfig {
    platform: 'browser' | 'node';
    packages?: 'external' | 'bundle';
    external?: Array<string>;
    minify?: boolean;
    sourcemap?: boolean;
    plugins?: Array<any>;
}

export interface IExposeEntry {
    version: number;
    name: string;
    target: string;
    watch?: boolean;
    config?: IEsbuildConfig;
}

export interface IExpose {
    config?: IEsbuildConfig;
    entries: Array<IExposeEntry>;
}

export interface IRemote {
    port?: number;
    host: string;
    entries: Array<{ host?: string; version: number; name: string }>;
}

export interface IPlayground {
    active: boolean;
    root: string;
}

export interface IConfig {
    platform: 'browser' | 'node';
    zipPass?: string;
    expose?: IExpose;
    remote?: IRemote;
    playground?: IPlayground;
}
