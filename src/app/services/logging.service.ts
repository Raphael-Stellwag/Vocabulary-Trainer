import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LogDto, LogLevel } from '../interfaces/log';
import { RestService } from './rest.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LoggingService {

    constructor(private rest: RestService, private httpClient: HttpClient) { }

    debug(message: string | object | number | boolean) {
        console.debug(message);
        this.log(message, LogLevel.DEBUG);
    }

    info(message: string | object | number | boolean) {
        console.info(message);
        this.log(message, LogLevel.INFO);
    }

    warn(message: string | object | number | boolean, additionalData: any = null) {
        console.warn(message);
        this.log(message, LogLevel.WARN);
    }

    error(message: string | object | number | boolean, additionalData: any = null) {
        console.error(message);
        this.log(message, LogLevel.ERROR);
    }

    private async postLog(log: LogDto) {
        if (!await this.rest.canReachTheBackend()) {
            return null;
        }

        await this.httpClient.post(environment.vocabulary_server.BASE_URL + "/log",
            JSON.stringify(log),
            { headers: this.rest.getHeaders() }).toPromise();
    }

    private log(message: string | object | number | boolean, level: LogLevel) {
        if (environment.level > level) {
            return;
        }


        let messageStr = '';
        switch (typeof(message)) {
            case 'string':
                messageStr = message;
                break;

            case 'number':
                messageStr = message.toString();
                break;

            case 'boolean':
                if (message == true) {
                    messageStr = "true";
                } else {
                    messageStr = "false";
                }
                break;

            case 'object':
                messageStr = JSON.stringify(message);
                break;
        }

        let dto = this.getDto(messageStr, level);

        this.postLog(dto);
    }

    private getDto(message: string, level: LogLevel): LogDto {

        let logDto = new LogDto();
        logDto.name = environment.name;
        logDto.version = environment.version;
        logDto.message = message;
        logDto.level = LogLevel[level];
        logDto.time = new Date();

        return logDto;
    }
}
