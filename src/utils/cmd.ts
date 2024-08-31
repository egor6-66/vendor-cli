const util = require('util');
const exec = util.promisify(require('child_process').exec);

interface IResult {
    stdout: string;
    stderr: string;
    error: string;
}

const cmd = async <T>(command: string, cb?: (result: IResult) => T): Promise<T> => {
    const result = await exec(command);

    if (cb) {
        return cb(result);
    }

    return result;
};

export default cmd;
