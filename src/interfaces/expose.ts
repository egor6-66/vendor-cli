import { BuildOptions } from 'esbuild';

type EsbuildConfig = Omit<BuildOptions, 'outdir' | 'entryPoints' | 'entryNames'>;

type Platform = 'browser' | 'node';

interface IPlayground {
    enabled?: boolean;
    root: string;
    htmlPath: string;
    esbuildConfig?: EsbuildConfig;
}

interface IServer {
    enabled?: boolean;
    port?: number;
    wsPort?: number;
    playground?: IPlayground;
}

export interface IArchive {
    lvl?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    pass?: string;
}

export interface IEntry {
    version: number;
    name: string;
    target: string;
    watch?: boolean;
    checkTypes?: boolean;
    esbuildConfig?: EsbuildConfig;
    original?: boolean;
    archive?: IArchive;
    platform?: Platform;
}

export interface IExpose {
    declarationTypes?: Array<string>;
    server?: IServer;
    esbuildConfig?: EsbuildConfig;
    entries: Array<IEntry>;
    platform?: Platform;
}

export default IExpose;
