import { Injectable } from '@angular/core';
import { VocabularyRestService } from './vocabulary-rest.service';
import { environment } from 'src/environments/environment';
import { LogDto, LogLevel } from '../interfaces/log';

@Injectable({
    providedIn: 'root'
})
export class LoggingService {

    constructor(private rest: VocabularyRestService) { }

    debug(message: string) {
        console.debug(message);
        this.log(message, LogLevel.DEBUG);
    }

    info(message: string) {
        console.info(message);
        this.log(message, LogLevel.INFO);
    }

    warn(message: string) {
        console.warn(message);
        this.log(message, LogLevel.WARN);
    }

    error(message: string) {
        console.error(message);
        this.log(message, LogLevel.ERROR);
    }

    private log(message: string, level: LogLevel) {
        if (environment.level > level) {
            return;
        }
        let dto = this.getDto(message, level);

        this.rest.postLog(dto);
    }

    private getDto(message: string, level: LogLevel): LogDto {

        let logDto = new LogDto();
        logDto.name = environment.name;
        logDto.version = environment.version;
        logDto.message = message;
        logDto.level = level;
        logDto.time = new Date();

        return logDto;
    }
}
