import { Component, Input } from '@angular/core';
import { DURATION, MARKER_RADIUS } from '../../../lib/constant';

export interface ClusterPoint {
  item: [number, number, any[]]
}

@Component({
  selector: '[app-cluster-point]',
  templateUrl: './cluster-point.component.html'
})
export class ClusterPointComponent {
  @Input() item: ClusterPoint;
  markerRadius = MARKER_RADIUS;
  protected transition = t => t.duration(DURATION);

  constructor() {
  }

  get gTransform(): string {
    return `translate(${this.item[0]},${this.item[1]})`;
  }

}
