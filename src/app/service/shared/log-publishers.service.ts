import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogConsole, LogLocalStorage, LogPublisher, LogWebApi, LogAuditApi } from './log-publishers';
import { environment } from 'environments/environment';
const PUBLISHERS_FILE = 'assets/log-config.json'; // Path for Log Configuration File


@Injectable()
export class LogPublishersService {
  env = environment.url;
  publishers: LogPublisher[] = [];

  constructor(private http: HttpClient) {
    this.buildPublishers(); // Build publishers arrays
  }

  buildPublishers(): void {
    let logPub: LogPublisher;
    this.getLoggers().subscribe(response => {
      for (const pub of response.filter(p => p.isActive)) {
        switch (pub.loggerName.toLowerCase()) {
          case 'console':
            logPub = new LogConsole();
            break;
          case 'localstorage':
            logPub = new LogLocalStorage();
            break;
          case 'clientlog':
            logPub = new LogWebApi(this.http);
            break;
          case 'auditlog':
            logPub = new LogAuditApi(this.http);
            break;
        }
        // Set location of logging
        logPub.location = this.env + pub.loggerLocation;
        // Add publisher to array
        this.publishers.push(logPub);
      }
    }, error => {
      console.error(' Unable to read Logger Configuration file from ' + PUBLISHERS_FILE);
    });
  }

  getLoggers(): Observable<LogPublisherConfig[]> {
    return this.http.get<LogPublisherConfig[]>(PUBLISHERS_FILE);
  }
}

class LogPublisherConfig {
  loggerName: string;
  loggerLocation: string;
  isActive: boolean;
}
