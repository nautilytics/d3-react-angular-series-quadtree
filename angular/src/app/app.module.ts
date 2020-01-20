import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { AxesComponent } from './visualization/axes/axes.component';
import { ClusterPointComponent } from './visualization/cluster-point/cluster-point.component';
import { PointsComponent } from './visualization/points/points.component';

@NgModule({
  declarations: [
    AppComponent,
    VisualizationComponent,
    AxesComponent,
    ClusterPointComponent,
    PointsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
