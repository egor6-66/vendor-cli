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
    serveStatic?: 'node' | 'nginx';
    playground?: IPlayground;
}

interface IExposeEntry {
    version: number;
    name: string;
    target: string;
    watch?: boolean;
    checkTypes?: boolean;
    esbuildConfig?: EsbuildConfig;
}

export interface IExpose {
    declarationTypes?: Array<string>;
    server?: IServer;
    esbuildConfig?: EsbuildConfig;
    entries: Array<IExposeEntry>;
}

export default IExpose;
