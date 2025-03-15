import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {ActivityDetailComponent} from './pages/activity-detail/activity-detail.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'activity/:id', component: ActivityDetailComponent}
];
