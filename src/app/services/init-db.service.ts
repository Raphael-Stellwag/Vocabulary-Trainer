import { Injectable } from '@angular/core';
import { IdbService } from './idb.service';
import { IDataBase, DATA_TYPE, ITable } from 'jsstore';
import * as JsStore from 'jsstore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InitDbService {

  private dbName = "Ts_Vocabulary";
  protected tableName = "Vocabulary";
  protected colId = "id";
  protected colClas = "clas";
  protected colUnit = "unit";
  protected colPrimaryLanguage = "primaryLanguage";
  protected colSecondaryLanguage = "secondaryLanguage";
  protected colTries = "tries";
  protected colFailuresCount = "failuresCount";

  constructor() {
    // initiate database when a service instance is initiated
    this.initDatabase();
  }

  /**
   * create database
   * 
   * @memberof IdbService
   */
  private initDatabase() {

    var dbNewlyCreated = this.connection.initDb(this.getDatabase());
    console.info(dbNewlyCreated);

    // initiate jsstore connection
    //var connection = new JsStore.Connection();
    //var isDbCreated

    /*
    this.connection.isDbExist(this.dbName).then(isExist => {
      if (isExist) {
        this.connection.openDb(this.dbName);
      } else {
        const dataBase = this.getDatabase();
        this.connection.initDb(dataBase);
      }
    }).catch(err => {
      // this will be fired when indexedDB is not supported.
      alert(err.message);
    });
    */
  }

  private getDatabase() {
    const tblVocabulary: ITable = {
      name: this.tableName,
      columns: {
        id: {
          primaryKey: true,
          autoIncrement: false
        },
        clas:
        {
          dataType: DATA_TYPE.String,
          notNull: true
        },
        unit:
        {

          dataType: DATA_TYPE.String,
          notNull: true
        },
        primaryLanguage:
        {
          notNull: true,
          dataType: DATA_TYPE.String
        },
        secondaryLanguage:
        {
          dataType: DATA_TYPE.String,
          notNull: true
        },
        tries:
        {
          dataType: DATA_TYPE.Number,
          notNull: true,
          default: '0'
        },
        failuresCount:
        {
          dataType: DATA_TYPE.Number,
          notNull: true,
          default: '0'
        }
      }
    };
    const dataBase: IDataBase = {
      name: this.dbName,
      tables: [tblVocabulary]
    };
    return dataBase;
  }

  get connection() {
    return IdbService.idbCon;
  }
}
