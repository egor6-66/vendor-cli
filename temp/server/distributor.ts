import { Express } from 'express';
import path from 'path';

import { projectName } from '../constants';
import { IDistConfig } from '../types';

function distributor(app: Express, config: IDistConfig) {
    app.get(`/types/:name`, (req, res) => {
        res.sendFile(path.resolve(path.join(`.${projectName}`, 'types', req.params.name)));
    });
}

export default distributor;
