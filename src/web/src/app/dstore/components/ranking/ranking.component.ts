import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable, Subscription, merge, timer, of } from 'rxjs';
import { map, tap, flatMap, shareReplay, switchMap, concat, startWith } from 'rxjs/operators';

import { BaseService } from '../../services/base.service';
import { App, AppService } from 'app/services/app.service';

import { Section } from '../../services/section';
import { AppFilterFunc, Allowed } from '../appFilter';
import { StoreService } from 'app/modules/client/services/store.service';
import {
  StoreJobInfo,
  StoreJobStatus,
  StoreJobType,
} from 'app/modules/client/models/store-job-info';
import { AppVersion } from 'app/modules/client/models/app-version';
import { JobService } from 'app/services/job.service';

@Component({
  selector: 'dstore-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent implements OnInit, OnDestroy {
  constructor(
    private appService: AppService,
    private storeService: StoreService,
    private jobService: JobService,
  ) {}

  metadataServer = BaseService.serverHosts.metadataServer;
  isNative = BaseService.isNative;
  StoreJobStatus = StoreJobStatus;
  StoreJobType = StoreJobType;

  @Input()
  section: Section;
  @Input()
  appFilter: AppFilterFunc = Allowed;

  appList: App[];
  jobs: { [key: string]: StoreJobInfo } = {};
  jobsNames = new Set<string>();
  jobs$: Subscription;
  version$: Subscription;

  // job control
  start = this.storeService.resumeJob;
  pause = this.storeService.pauseJob;
  openApp = this.storeService.openApp;

  ngOnInit() {
    const category = this.section.ranking.category;
    this.appService.list().subscribe(async apps => {
      if (category) {
        apps = apps.filter(app => app.category === category);
      }
      apps = apps.sort((a, b) => b.downloads - a.downloads).slice(0, this.section.ranking.count);
      if (BaseService.isNative) {
        const versionMap = await this.storeService
          .getVersionMap(apps.map(app => app.name))
          .toPromise();
        apps = apps.filter(app => versionMap.has(app.name));
      }
      this.appList = apps;
      this.getJobs();
      this.getVersion();
    });
  }

  getJobs() {
    this.jobs$ = this.jobService.jobsInfo().subscribe(jobInfos => {
      const jobs = {};
      jobInfos.forEach(job => {
        job.names.forEach(name => {
          jobs[name] = job;
          this.jobsNames.add(name);
        });
      });
      this.jobs = jobs;
    });
  }
  getVersion() {
    if (this.appList) {
      this.version$ = this.jobService
        .jobList()
        .pipe(
          flatMap(() => {
            return this.storeService.getVersion(this.appList.map(app => app.name));
          }),
        )
        .subscribe(versions => {
          const vMap = new Map(versions.map(v => [v.name, v] as [string, AppVersion]));
          this.appList.forEach(app => {
            if (vMap.has(app.name)) {
              app.version = vMap.get(app.name);
            }
          });
        });
    }
  }
  ngOnDestroy() {
    if (this.jobs$) {
      this.jobs$.unsubscribe();
    }
    if (this.version$) {
      this.version$.unsubscribe();
    }
  }

  installApp(app: App) {
    this.storeService.installPackage(app.name, app.localInfo.description.name).subscribe();
  }
  updateApp(app: App) {
    this.storeService.updatePackage(app.name, app.localInfo.description.name).subscribe();
  }

  // Show 'open' button only if app open method is 'desktop'.
  appOpenable(app: App): boolean {
    return app.extra.open === 'desktop';
  }
}
