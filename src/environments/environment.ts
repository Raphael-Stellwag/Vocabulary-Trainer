// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { LogLevel } from 'src/app/interfaces/log';
import pkg from '../../package.json';

export const environment = {
    name: pkg.name,
    version: pkg.version + '-DEV',
    level: LogLevel.DEBUG,
    production: false,
    auth: {
        URL: 'http://localhost:8180',
        REALM: 'Voc-Realm',
        CLIENT_ID: 'voc-angular-application',
    },
    vocabulary_server: {
        BASE_URL: 'http://localhost:8080/api/v1',
    },
};
