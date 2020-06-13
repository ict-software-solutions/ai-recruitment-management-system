import { Injectable } from '@angular/core';
// import { UserService } from '../user.service';
import { LogLevel } from './log-level.enum';
import { LogPublisher } from './log-publishers';
import { LogPublishersService } from './log-publishers.service';
// import { NGaugeService } from './ngauge.service';

@Injectable()
export class LogService {
  level: LogLevel = LogLevel.All;
  logWithDate = true;
  publishers: LogPublisher[];
 

  constructor(private publishersService: LogPublishersService) {
    this.publishers = this.publishersService.publishers;
  }

  debug(msg: any,  ...optionalParams: any[]) {
    this.writeToLog(msg,  LogLevel.Debug, optionalParams);
  }

  info(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg,  LogLevel.Info, optionalParams);
  }

  warn(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg,  LogLevel.Warn, optionalParams);
  }

  error(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg,  LogLevel.Error, optionalParams);
  }

  fatal(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg,  LogLevel.Fatal, optionalParams);
  }

  log(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg,  LogLevel.All, optionalParams);
  }

  private writeToLog(msg: any,level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      let entry: any;
      entry = { ...msg };
      entry.level = LogLevel[level];
      for (const logger of this.publishers) {
        logger.log(entry).subscribe();
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    let ret = false;
    if ((level >= this.level &&
      level !== LogLevel.Off) ||
      this.level === LogLevel.All) {
      ret = true;
    }
    return ret;
  }

  logError(logLevel, screen, whereArise, message) {
    const params = {
      createdBy: 0, // UserId
      screen,
      whereArise,
      message,
      whenOccur: new Date() // Should assigned from Server
    }
    this[logLevel](params);
  }
}

export class LogEntry {
  level: string = LogLevel[LogLevel.Debug];
}
