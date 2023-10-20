// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import pkg from '../../package.json';

export const environment = {
  version: pkg.version + "-DEV",
  production: false,
  auth: {
    LOGIN: "http://localhost:3010/v1/users/login",
    REGISTER: "http://localhost:3010/v1/users/register",
  },
  vocabulary_server: {
    URL: "http://localhost:3010/v1/actions",
    //URL: "https://raphael-stellwag.tk/api/voc-trainer/v1/actions",
    //URL: "http://www.vocabulary-trainer.ml/vocabulary-trainer/v1/actions",
    //    URL: "https://vocabulary-trainer.ml/vocabulary-trainer/v1/actions",
  }
};
