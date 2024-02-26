import * as JsStore from 'jsstore';
import * as workerPath from 'file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js';
declare var require: any;

export class IdbService {
  // this will make sure that we are using one instance
  // otherwise multiple instance will be created and thus multiple worker and that may create some problems
  static idbCon = new JsStore.Connection(new Worker(IdbService.getWorkerPath().default));

  static getWorkerPath() {
    return require('file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js');
  }
}