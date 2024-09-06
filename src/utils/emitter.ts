import { EventEmitter } from 'events';

const emitter = new EventEmitter();

type Events = 'renderHTML' | 'updateBundle' | 'updateTypes';

interface IEmitter {
    on: (event: Events, cb: (data: any) => void) => void;
    emit: (event: Events, data?: string) => void;
}

function on(event: Events, cb: (data?: any) => void) {
    return emitter.on(event, (data) => {
        data && cb(JSON.parse(data));
    });
}

function emit(event: Events, data: any) {
    return emitter.emit(event, JSON.stringify(data));
}

export type { IEmitter };
export { emit, on };
