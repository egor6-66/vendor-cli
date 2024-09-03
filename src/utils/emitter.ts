import { EventEmitter } from 'events';

const emitter = new EventEmitter();

type Events = 'renderHTML' | 'updateEntry';

interface IEmitter {
    on: (event: Events, cb: (data: string) => void) => void;
    emit: (event: Events, data?: string) => void;
}

function on(event: Events, cb: (data: string) => void) {
    return emitter.on(event, cb);
}

function emit(event: Events, data: string) {
    return emitter.emit(event, data);
}

export type { IEmitter };
export { emit, on };
