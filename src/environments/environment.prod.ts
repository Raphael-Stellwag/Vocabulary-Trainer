
import { LogLevel } from 'src/app/interfaces/log';
import pkg from '../../package.json';

export const environment = {
    name: pkg.name,
    version: pkg.version,
    level: LogLevel.DEBUG,
    production: true,
    auth: {
        URL: 'http://localhost:8180',
        REALM: 'Voc-Realm',
        CLIENT_ID: 'voc-angular-application',
    },
    vocabulary_server: {
        BASE_URL: 'http://localhost:8080/api/v1',
    }
};
