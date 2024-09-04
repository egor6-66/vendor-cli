import IExpose from './expose';
import IRemote from './remote';

interface IConfig {
    expose?: IExpose;
    remote?: IRemote;
}

export type { IConfig };
