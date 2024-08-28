import fs from 'fs';
import path from 'path';

import { serverType } from '../constants';

interface IState {
    webpack: 'client' | 'vendor';
    serverType: serverType;
}
const statePath = path.join(__dirname, '../', '../', '../', 'src', 'state', 'state.json');
const state = require(statePath);

export default {
    get: (key: keyof IState) => {
        return state[key];
    },
    set: (obj: Partial<IState>) => {
        fs.writeFileSync(statePath, JSON.stringify({ ...state, ...obj }, null, 2));
    },
};
