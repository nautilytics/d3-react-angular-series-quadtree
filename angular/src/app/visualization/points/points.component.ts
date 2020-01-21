import { Component, Input } from '@angular/core';
import { MARKER_RADIUS } from '../../../lib/constant';

export interface Point {
  item: [number, number, any]
}

@Component({
  selector: '[app-points]',
  templateUrl: './points.component.html'
})
export class PointsComponent {
  @Input() points: Point[];
  markerRadius = MARKER_RADIUS;

  constructor() {
    console.log(this.points);
  }

}
