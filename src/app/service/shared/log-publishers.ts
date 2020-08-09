import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import 'rxjs/add/observable/of';
import { Observable, from } from 'rxjs';
import { LogLevel } from './log-level.enum';
import { LogEntry } from './log.service';
import { of } from 'rxjs';

// import 'rxjs/add/observable/of';
export abstract class LogPublisher {
  location: string;
  abstract log(record: LogEntry): Observable<boolean>;
  abstract clear(): Observable<boolean>;

  postToAPI(location, entry, http) {
    console.log('location', location);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    http.post(location, entry, httpOptions).subscribe(() => { },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      }
    );
  }
}

export class LogConsole extends LogPublisher {
  log(entry: LogEntry): Observable<boolean> {
    const logLevel = LogLevel[entry.level];
    const message = JSON.stringify(entry);
    switch (logLevel) {
      case LogLevel.Warn:
        console.warn(message);
        break;
      case LogLevel.Error:
        console.error(message);
        break;
      default:
        console.log(message);
        break;
    }
    return of(true);
  }

  clear(): Observable<boolean> {
    console.clear();
    return of(true);
  }
}

export class LogLocalStorage extends LogPublisher {
  location: any;
  constructor() {
    super();
    this.location = '$$MyApp-Log-Id$$';
  }

  // Append log entry to local storage
  log(entry: LogEntry): Observable<boolean> {
    let ret = false;
    let values: LogEntry[];
    try {
      // Get previous values from local storage
      values = JSON.parse(localStorage.getItem(this.location)) || [];
      values.push(entry);
      // Store array into local storage
      localStorage.setItem(this.location, JSON.stringify(values));
      // Set return value
      ret = true;
    } catch (ex) {
      // Display error in console
      console.log(ex);
    }
    return of(ret);
  }

  // Clear all log entries from local storage
  clear(): Observable<boolean> {
    localStorage.removeItem(this.location);
    return of(true);
  }
}

export class LogWebApi extends LogPublisher {
  location: any;
  constructor(private http: HttpClient) {
    super();
  }

  // Add log entry to back end data store
  log(entry: LogEntry): Observable<boolean> {
    if (entry['logErr']) {
      super.postToAPI(this.location, entry, this.http);
    }
    return of(true);
  }

  clear(): Observable<boolean> {
    console.clear();
    return of(true);
  }
}


export class LogAuditApi extends LogPublisher {
  location: any;
  constructor(private http: HttpClient) {
    super();
  }
  // Add log entry to back end data store
  log(entry: LogEntry): Observable<boolean> {
    if (entry['logActivity']) {
      super.postToAPI(this.location, entry, this.http);
    }
    return of(true);
  }

  clear(): Observable<boolean> {
    console.clear();
    return of(true);
  }
}
