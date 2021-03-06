import { Component, OnInit, HostBinding, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { get, parseInt } from 'lodash';
import { Observable, forkJoin, iif, of } from 'rxjs';
import { map, flatMap, tap, switchMap } from 'rxjs/operators';

import { SectionTopic } from 'app/dstore/services/section';
import { BaseService } from 'app/dstore/services/base.service';
import { AppService } from 'app/services/app.service';

import { App } from 'app/dstore/services/app';
import { SectionService } from '../../services/section.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private sectionService: SectionService,
  ) {}
  @ViewChild('topicContainer') topicContainer: ElementRef<HTMLDivElement>;

  server = BaseService.serverHosts.operationServer;
  topic: SectionTopic;
  apps$: Observable<App[]>;

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap(
          () => this.sectionService.getList(),
          (param, sectionList) => {
            const sectionIndex = parseInt(param.get('section'), 10);
            const topicIndex = parseInt(param.get('topic'), 10);
            return get(sectionList, [sectionIndex, 'items', topicIndex]) as SectionTopic;
          },
        ),
      )
      .subscribe(topic => {
        this.topic = topic;
        this.apps$ = this.appService.getApps(
          topic.apps.filter(app => app.show).map(app => app.name),
        );
      });
  }

  loaded() {
    const el = this.topicContainer.nativeElement;

    el.hidden = false;
    Array.from(el.querySelectorAll<HTMLDivElement>('.name')).forEach(name => {
      name.style.color = this.topic.nameColor;
    });

    Array.from(el.querySelectorAll<HTMLDivElement>('.subtitle')).forEach(subtitle => {
      subtitle.style.color = this.topic.subTitleColor;
    });
  }
}
