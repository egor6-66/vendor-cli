const util = require('util');
const exec = util.promisify(require('child_process').exec);
import childProcess, { ChildProcess } from 'child_process';

interface IResult {
    stdout: string;
    stderr: string;
    error: string;
}

const stream = async <T>(command: string, cb?: (result: IResult) => T): Promise<T> => {
    const result = await exec(command);

    return cb ? cb(result) : result;
};

const separate = (command: string, cb?: (result: ChildProcess) => void) => {
    const result = childProcess.exec(command);

    return cb ? cb(result) : result;
};

export { separate, stream };
