import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IRestVocabulary, Vocabulary } from '../interfaces/vocabulary';
import { environment } from 'src/environments/environment';
import { RestService } from './rest.service';
import { LoggingService } from './logging.service';


@Injectable({
    providedIn: 'root'
})
export class VocabularyRestService {

    constructor(private httpClient: HttpClient, private rest: RestService, private log: LoggingService) {
    }

    async postVocabulary(voc: Vocabulary): Promise<Vocabulary | null> {
        if (!await this.rest.canReachTheBackend()) {
            return null;
        }

        const result = await this.httpClient.post(environment.vocabulary_server.BASE_URL + '/vocabulary',
            JSON.stringify(voc), { headers: this.rest.getHeaders() }).toPromise() as IRestVocabulary;

        this.log.info(result);
        if (result !== null) {
            return this.dtoToVocabulary(result);
        }

        return null;
    }

    async putVocabulary(voc: Vocabulary) {
        if (!await this.rest.canReachTheBackend()) {
            return null;
        }

        const result = await this.httpClient.put(environment.vocabulary_server.BASE_URL + '/vocabulary/' + voc.id,
            JSON.stringify(voc), { headers: this.rest.getHeaders() }).toPromise() as IRestVocabulary;

        this.log.info(result);
        if (result !== null) {
            return this.dtoToVocabulary(result);
        }

        return null;
    }

    async deleteVocabulary(voc: Vocabulary): Promise<boolean> {
        if (!await this.rest.canReachTheBackend()) {
            return false;
        }

        await this.httpClient.delete(environment.vocabulary_server.BASE_URL + '/vocabulary/' + voc.id,
            { headers: this.rest.getHeaders() }).toPromise();

        return true;
    }

    async getVocUpdatesSinceDate(lastSyncDate: Date) {
        if (!await this.rest.canReachTheBackend()) {
            return null;
        }

        const params = new HttpParams().set('from_last_changed', lastSyncDate.toISOString());

        const object = await this.httpClient.get(environment.vocabulary_server.BASE_URL + '/vocabulary',
            { headers: this.rest.getHeaders(), params: params }).toPromise() as any;

        return this.dtosToVocabularies(object.list);
    }

    async getAllVocIds(): Promise<Set<string>> {
        if (!await this.rest.canReachTheBackend()) {
            return null;
        }

        const object = await this.httpClient.get(environment.vocabulary_server.BASE_URL + '/vocabulary/ids',
            { headers: this.rest.getHeaders() }).toPromise() as any;

        return new Set(object.ids);
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

}
