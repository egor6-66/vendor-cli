import { spawn } from 'child_process';

function compress(path: string) {
    const splitPath = path.split('/');
    const zip = spawn('zip', ['-P', 'password', splitPath.pop() as string, path]);
}

export { compress };
