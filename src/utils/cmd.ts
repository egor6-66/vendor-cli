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

const getArgs = () => {
    return process.argv.reduce((args: any, arg) => {
        if (arg.slice(0, 2) === '--') {
            const longArg = arg.split('=');
            const longArgFlag = longArg[0].slice(2);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        } else if (arg[0] === '-') {
            const flags = arg.slice(1).split('');
            flags.forEach((flag) => {
                args[flag] = true;
            });
        }

        return args;
    }, {});
};

export { getArgs, separate, stream };
