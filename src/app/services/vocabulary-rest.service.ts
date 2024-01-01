import {InternetConnectionService} from './internet-connection.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthService} from './auth.service';
import {IVocabulary, Vocabulary} from '../interfaces/vocabulary';
import {LocalStorageNamespace} from './local-storage.namespace';
import {environment} from 'src/environments/environment';
import {Action, ActionMethod, IAction} from '../interfaces/action';
import {DbFunctionService} from './db/db-function.service';


@Injectable({
    providedIn: 'root'
})
export class VocabularyRestService {

    constructor(private httpClient: HttpClient, private auth: AuthService, private dbFunctions: DbFunctionService,
                private internetConnection: InternetConnectionService) {
    }

    async canReachTheBackend() {
        return (await this.auth.isLoggedIn() && this.internetConnection.isConnected());
    }

    async postVocabulary(voc: Vocabulary): Promise<Vocabulary | null> {
        if (!await this.canReachTheBackend()) {
            return null;
        }

        const result = await this.httpClient.post(environment.vocabulary_server.URL, JSON.stringify(voc),
            {headers: this.getHeaders()}).toPromise() as IVocabulary;

        console.log(result);
        if (result !== null) {
            return this.dtoToVocabulary(result);
        }

        return null;
    }

    async putVocabulary(voc: Vocabulary) {
        if (!await this.canReachTheBackend()) {
            return null;
        }

        const result = await this.httpClient.put(environment.vocabulary_server.URL + '/' + voc.id, JSON.stringify(voc),
            {headers: this.getHeaders()}).toPromise() as IVocabulary;

        console.log(result);
        if (result !== null) {
            return this.dtoToVocabulary(result);
        }

        return null;
    }

    async deleteVocabulary(voc: Vocabulary): Promise<boolean> {
        if (!await this.canReachTheBackend()) {
            return false;
        }

        await this.httpClient.delete(environment.vocabulary_server.URL + '/' + voc.id,
            {headers: this.getHeaders()}).toPromise();

        return true;
    }

    private getHeaders() {
        return new HttpHeaders()
            .set('Content-Type', 'application/json; charset=utf-8')
            .set('Accept', 'application/json');
    }

    private dtoToVocabulary(dto: IVocabulary): Vocabulary {
        return new Vocabulary(dto.id,
            dto.success_count,
            dto.failures_count,
            dto.class,
            dto.unit,
            dto.primary_language,
            dto.secondary_language,
            new Date(dto.last_changed),
            false,
            true);
    }

    private dtosToVocabularies(dtos): Vocabulary[] {
        const vocs: Vocabulary[] = [];
        for (const dto of dtos.list) {
            vocs.push(this.dtoToVocabulary(dto));
        }
        return vocs;
    }

    //TODO: Implement in Backend
    async getVocUpdatesSinceDate(lastSyncDate: Date) {
        if (!await this.canReachTheBackend()) {
            return null;
        }

        const params = new HttpParams().set('from_last_update_date', lastSyncDate.toISOString());

        const object = await this.httpClient.get(environment.vocabulary_server.URL,
            {headers: this.getHeaders(), params: params}).toPromise() as any;

        return this.dtosToVocabularies(object);
    }
}
