export interface IEsbuildConfig {
    platform: 'browser' | 'node';
    packages?: 'external' | 'bundle';
    external?: Array<string>;
    minify?: boolean;
    sourcemap?: boolean;
    plugins?: Array<any>;
}

export interface IPlayground {
    disabled?: boolean;
    root: string;
    config: IEsbuildConfig;
}

export interface IServer {
    disabled?: boolean;
    port?: number;
    server?: 'node' | 'nginx';
    playground?: IPlayground;
}

export interface IExposeEntry {
    version: number;
    name: string;
    target: string;
    watch?: boolean;
    config: IEsbuildConfig;
}

export interface IExpose {
    server?: IServer;
    config?: IEsbuildConfig;
    entries: Array<IExposeEntry>;
}

export interface IRemote {
    port?: number;
    host: string;
    entries: Array<{ host?: string; version: number; name: string }>;
}

export interface IConfig {
    expose?: IExpose;
    remote?: IRemote;
}
