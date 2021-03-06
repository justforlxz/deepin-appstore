import { Component, OnInit, Input, Output, OnDestroy, EventEmitter } from '@angular/core';

import { Observable, Subscription, merge, timer, of } from 'rxjs';
import { map, tap, flatMap, shareReplay, switchMap, concat, startWith } from 'rxjs/operators';

import { BaseService } from '../../services/base.service';
import { AppService, App } from '../../../services/app.service';
import { SectionApp, Section } from '../../services/section';
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
  selector: 'dstore-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit, OnDestroy {
  constructor(
    private appService: AppService,
    private storeService: StoreService,
    private jobService: JobService,
  ) {}
  metadataServer = BaseService.serverHosts.metadataServer;
  isNative = BaseService.isNative;
  StoreJobStatus = StoreJobStatus;
  StoreJobType = StoreJobType;
  @Output()
  loaded = new EventEmitter<Boolean>();
  @Input()
  section: Section;
  @Input()
  apps: SectionApp[];
  @Input()
  appFilter: AppFilterFunc = Allowed;

  // data
  moreNav: any[] = [];
  appList: App[] = [];
  jobs: { [key: string]: StoreJobInfo } = {};
  jobsNames = new Set<string>();
  jobs$: Subscription;

  // job control
  start = this.storeService.resumeJob;
  pause = this.storeService.pauseJob;
  openApp = this.storeService.openApp;

  ngOnInit() {
    this.jobService
      .jobList()
      .pipe(
        flatMap(() => {
          return this.appService.getApps(this.apps.filter(app => app.show).map(app => app.name));
        }),
      )
      .subscribe(appList => {
        this.appList = appList;
        this.moreNav = [
          './apps',
          { title: this.section.title, apps: appList.map(app => app.name) },
        ];
        this.loaded.emit(true);
      });
    this.getJobs();
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
  ngOnDestroy() {
    if (this.jobs$) {
      this.jobs$.unsubscribe();
    }
  }
}
