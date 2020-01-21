import { Component, Input } from '@angular/core';
import { DURATION, MARKER_RADIUS } from '../../../lib/constant';
import { ClusterPoint } from '../cluster-point/cluster-point.component';

@Component({
  selector: '[app-points]',
  templateUrl: './points.component.html'
})
export class PointsComponent {
  @Input() item: ClusterPoint;
  @Input() isClustered: number;
  markerRadius = MARKER_RADIUS;
  protected transition = t => t.duration(DURATION);

  protected trackByPoint(index: number, obj: object): any {
    return obj[2].id;
  }
}
