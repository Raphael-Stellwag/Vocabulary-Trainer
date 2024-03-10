
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class LogDto {
  time: Date;
  name: string;
  version: string;
  message: string;
  level: LogLevel;
  //additional_properties: object;
}
