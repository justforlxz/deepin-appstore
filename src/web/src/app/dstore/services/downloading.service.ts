import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { flatMap, map, shareReplay } from 'rxjs/operators';
import * as _ from 'lodash';

import { App, appSearch } from './app';
import { AppService } from './app.service';
import { CategoryService } from '../../dstore/services/category.service';
import { BaseService } from './base.service';
import { zip } from 'rxjs';

export class AppDownloading {
  appName: string;
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class DownloadingService {
  operationServer: string;
  constructor(private http: HttpClient, private appService: AppService) {}
  downloadList$ = this.http
    .get<{ apps: AppDownloading[] }>(`${this.operationServer}/api/downloading`)
    .pipe(
      map(result => new Map(result.apps.map(app => [app.appName, app.count] as [string, number]))),
      shareReplay(1),
    );

  getList(search?: string) {
    this.operationServer = BaseService.serverHosts.operationServer;
    return zip(this.appService.getAppList(), this.downloadList$).pipe(
      map(([apps, downloads]) => {
        return apps.sort((a, b) => downloads.get(a.name) - downloads.get(b.name));
      }),
    );
  }
}
