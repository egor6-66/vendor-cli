const util = require('util');
const child_process = require('child_process');
const execPromise = util.promisify(child_process.exec);

interface IResult {
    stdout: string;
    stderr: string;
    error: string;
}

const exec = async <T>(command: string, cb?: (result: IResult) => T): Promise<T> => {
    const result = await execPromise(command);

    return cb ? cb(result) : result;
};

const execSync = (command: string, listener?: ({ msg, error }: { msg: string; error: string }) => void) => {
    const result = child_process.exec(command);

    if (listener) {
        result.stdout.on('data', (msg) => listener({ msg, error: '' }));
        result.stdout.on('error', (err) => listener({ msg: '', error: err }));
    }
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

export { exec, execSync, getArgs };
