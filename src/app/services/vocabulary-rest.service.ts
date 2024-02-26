import {InternetConnectionService} from './internet-connection.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthService} from './auth.service';
import {IRestVocabulary, Vocabulary} from '../interfaces/vocabulary';
import {environment} from 'src/environments/environment';
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

        const result = await this.httpClient.post(environment.vocabulary_server.URL,
            JSON.stringify(voc), {headers: this.getHeaders()}).toPromise() as IRestVocabulary;

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

        const result = await this.httpClient.put(environment.vocabulary_server.URL + '/' + voc.id,
            JSON.stringify(voc), {headers: this.getHeaders()}).toPromise() as IRestVocabulary;

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

    private dtoToVocabulary(dto: IRestVocabulary): Vocabulary {
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

    private dtosToVocabularies(dtos: IRestVocabulary[]): Vocabulary[] {
        const vocs: Vocabulary[] = [];
        for (const dto of dtos) {
            vocs.push(this.dtoToVocabulary(dto));
        }
        return vocs;
    }

    async getVocUpdatesSinceDate(lastSyncDate: Date) {
        if (!await this.canReachTheBackend()) {
            return null;
        }

        const params = new HttpParams().set('from_last_changed', lastSyncDate.toISOString());

        const object = await this.httpClient.get(environment.vocabulary_server.URL,
            {headers: this.getHeaders(), params: params}).toPromise() as any;

        return this.dtosToVocabularies(object.list);
    }

    async getAllVocIds(): Promise<Set<string>> {
        if (!await this.canReachTheBackend()) {
            return null;
        }

        const object = await this.httpClient.get(environment.vocabulary_server.URL + '/ids',
            {headers: this.getHeaders()}).toPromise() as any;

        return new Set(object.ids);
    }
}
