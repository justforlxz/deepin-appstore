import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RankingComponent } from './components/ranking/ranking.component';

const routes: Routes = [
  {
    path: '',
    component: RankingComponent,
  },
  {
    path: ':appName',
    loadChildren: 'app/modules/details/details.module#DetailsModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RankingRoutingModule {}
