import { Injectable } from '@angular/core';
// import { UserService } from '../user.service';
import { LogLevel } from './log-level.enum';
import { LogPublisher } from './log-publishers';
import { LogPublishersService } from './log-publishers.service';
import { AirmsService } from '../airms.service';
// import { NGaugeService } from './ngauge.service';

@Injectable()
export class LogService {
  level: LogLevel = LogLevel.All;
  logWithDate = true;
  publishers: LogPublisher[];
  constructor(private publishersService: LogPublishersService, private airmsService: AirmsService) {
    this.publishers = this.publishersService.publishers;
  }

  debug(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  log(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  private writeToLog(msg: any, level: LogLevel, params: any[]) {
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
//dinesh updated
  logUserActivity(logLevel, whereArise, whatEnsue) {
    const params = { 
      createdBy: this.airmsService.getUserFirstLastName(),
      whereArise,
      whatEnsue,
      whenOccur: new Date(),
      logActivity: true,
      logErr: false,
      logFieldHistory: false
    }
    this[logLevel](params);
  }
// Email
  logUserActivityForEmail(logLevel, mail, whereArise, whatEnsue) {
    const params = { 
      createdBy: mail,
      whereArise,
      whatEnsue,
      whenOccur: new Date(),
      logActivity: true,
      logErr: false,
      logFieldHistory: false
    }
    this[logLevel](params);
  }

  logError(logLevel, screen, whereArise, message) {
    const params = {
      logLevel: logLevel,
      createdBy: this.airmsService.getUserFirstLastName(), 
      whichPlace: screen,
      whereArise,
      logMessage: JSON.stringify(message),
      whenOccur: new Date(), // Should assigned from Server
      logActivity: false,
      logErr: true,
      logFieldHistory: false
    }
    this[logLevel](params);
  }

  logErrorForEmail(logLevel, mail, screen, whereArise, message) {
    const params = {
      logLevel: logLevel,
      createdBy: mail, // UserId
      whichPlace: screen,
      whereArise,
      logMessage: JSON.stringify(message),
      whenOccur: new Date(), // Should assigned from Server
      logActivity: false,
      logErr: true,
      logFieldHistory: false
    }
    this[logLevel](params);
  }

  logFieldHistory(logLevel, whereArise, screen, field, oldVal, newVal) {
    const params = {
      createdBy: this.airmsService.getUserFirstLastName(), 
      whereArise,
      screen,
      field,
      oldVal,
      newVal,
      whenOccur: new Date(),
      logActivity: false,
      logFieldHistory: true,
      logErr: false
    }
    this[logLevel](params);
  }
}


export class LogEntry {
  level: string = LogLevel[LogLevel.Debug];
}
