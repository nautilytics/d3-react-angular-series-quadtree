import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { AxesComponent } from './visualization/axes/axes.component';
import { ClusterPointComponent } from './visualization/cluster-point/cluster-point.component';
import { PointsComponent } from './visualization/points/points.component';
import { SvgTransitionDirective } from '../directives/svg-transition.directive';

@NgModule({
  declarations: [
    AppComponent,
    VisualizationComponent,
    AxesComponent,
    ClusterPointComponent,
    PointsComponent,
    SvgTransitionDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
