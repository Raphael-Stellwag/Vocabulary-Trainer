import pkg from '../../package.json';

export const environment = {
  version: pkg.version,
  production: true,
  auth: {
    LOGIN: "https://raphael-stellwag.tk/api/voc-trainer/v1/users/login",
    REGISTER: "https://raphael-stellwag.tk/api/voc-trainer/v1/users/register",
  },
  vocabulary_server: {
    URL: "https://raphael-stellwag.tk/api/voc-trainer/v1/actions",
    //URL: "https://www.vocabulary-trainer.ml/vocabulary-trainer/v1/actions",
  }
};
