import {Injectable} from '@angular/core';
import {IdbService} from './idb.service';
import {IDataBase, DATA_TYPE, ITable} from 'jsstore';
import * as JsStore from 'jsstore';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InitDbService {

    private dbName = 'Ts_Vocabulary';
    protected tableName = 'Vocabulary';
    protected colId = 'id';
    protected colClass = 'class';
    protected colUnit = 'unit';
    protected colPrimaryLanguage = 'primary_language';
    protected colSecondaryLanguage = 'secondary_language';
    protected colSuccessCount = 'success_count';
    protected colFailuresCount = 'failures_count';

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

        const dbNewlyCreated = this.connection.initDb(this.getDatabase());
        console.info(dbNewlyCreated);

        // initiate jsstore connection
        // var connection = new JsStore.Connection();
        // var isDbCreated

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
                class:
                    {
                        dataType: DATA_TYPE.String,
                        notNull: true
                    },
                unit:
                    {
                        dataType: DATA_TYPE.String,
                        notNull: true
                    },
                primary_language:
                    {
                        notNull: true,
                        dataType: DATA_TYPE.String
                    },
                secondary_language:
                    {
                        dataType: DATA_TYPE.String,
                        notNull: true
                    },
                success_count:
                    {
                        dataType: DATA_TYPE.Number,
                        notNull: true,
                        default: '0'
                    },
                failures_count:
                    {
                        dataType: DATA_TYPE.Number,
                        notNull: true,
                        default: '0'
                    },
                deleted:
                    {
                        dataType: DATA_TYPE.String,
                        notNull: true,
                        default: 'false'
                    },
                synced:
                    {
                        dataType: DATA_TYPE.String,
                        notNull: true,
                        default: 'true'
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
