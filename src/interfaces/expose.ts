import { BuildOptions } from 'esbuild';

type EsbuildConfig = Omit<BuildOptions, 'outdir' | 'entryPoints' | 'entryNames'>;

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

export interface IEntry {
    version: number;
    name: string;
    target: string;
    watch?: boolean;
    checkTypes?: boolean;
    esbuildConfig?: EsbuildConfig;
    original?: 'file' | 'folder';
}

export interface IExpose {
    declarationTypes?: Array<string>;
    server?: IServer;
    esbuildConfig?: EsbuildConfig;
    entries: Array<IEntry>;
}

export default IExpose;
