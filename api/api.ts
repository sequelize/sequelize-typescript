///<reference path="../typings/node/node.d.ts"/>

import ApiUnus from './ApiUnus';
import ApiDuo from './ApiDuo';
import ApiTres from './ApiTres';

export default {
    v1: new ApiUnus(),
    v2: new ApiDuo(),
    v3: new ApiTres()
}
