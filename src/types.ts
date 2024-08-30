export interface IExpose {
    minify?: boolean;
    sourcemap?: boolean;
    entries: Array<{ version: number; name: string; target: string; deps: Array<string> }>;
}

export interface IRemote {
    host: string;
    name: string;
    entries: Array<{ host?: string; version: number; name: string }>;
}

export interface IConfig {
    platform: 'browser' | 'node';
    zipPass?: string;
    expose?: IExpose;
    remote?: IRemote;
}

export interface IStaticServerProps {
    port: number;
    watch: boolean;
    pm2: boolean;
}

export interface IBuildArgs extends IStaticServerProps {
    runServer: boolean;
}

export interface IClientServerProps {
    port: number;
    watch: boolean;
}

export type ITakeArgs = IClientServerProps;
