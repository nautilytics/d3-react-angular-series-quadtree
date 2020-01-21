import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AxesItem } from './axes/axes.component';
import { range } from 'd3-array';
import { scaleTime } from 'd3-scale';
import { quadtree as d3_quadtree } from 'd3-quadtree';
import { addStartTime, getRandomMinute, getTimeForYAxis, greatestCommonDivisor, search } from '../../lib/util';
import { DURATION, MARKER_RADIUS, NUMBER_OF_DAYS } from '../../lib/constant';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html'
})
export class VisualizationComponent implements OnInit {
  xScale = scaleTime();
  yScale = scaleTime();
  width = 1000;
  height = 600;
  margin = {
    left: 80,
    right: 40,
    bottom: 40,
    top: 80
  };
  markerRadius = MARKER_RADIUS;
  clusterRange: number;
  clusterPoints: any[];
  data: any[];
  isClustered = 0;

  constructor(protected element: ElementRef) {
  }

  get innerHeight(): number {
    return this.height - this.margin.top - this.margin.bottom;
  }

  get innerWidth(): number {
    return this.width - this.margin.left - this.margin.right;
  }

  ngOnInit(): void {
    this.draw();

    // After a few seconds, begin the animation to show points moving into clusters
    setTimeout(() => {
      this.isClustered = 1;
    }, DURATION)
  }

  updateData() {
    this.setAxisScales();
    this.data = range(150).map(d => {
      const dt = addStartTime(moment()
        .subtract(Math.floor(Math.random() * NUMBER_OF_DAYS), 'days'))
        .add(Math.floor(Math.random() * 9), 'hours')
        .add(getRandomMinute(), 'minutes');
      return [
        this.xScale(dt),
        this.yScale(getTimeForYAxis(dt)),
        {
          id: d,
          name: `name-of-${d}`,
          r: this.markerRadius
        }
      ];
    });
    this.getClusterPoints();
  }

  getClusterPoints() {
    // Create cluster points, i.e. an array of:
    // [[cluster_x, cluster_y, [points_to_cluster], ...]
    const quadtree = d3_quadtree().addAll(this.data);
    this.clusterPoints = [];
    for (let x = 0; x <= this.innerWidth; x += this.clusterRange) {
      for (let y = 0; y <= this.innerHeight; y += this.clusterRange) {
        let searched = search(quadtree, x, y, x + this.clusterRange, y + this.clusterRange);

        let centerPoint = searched.reduce((prev, current) => {
          return [prev[0] + current[0], prev[1] + current[1]];
        }, [0, 0]);

        centerPoint[0] = centerPoint[0] / searched.length;
        centerPoint[1] = centerPoint[1] / searched.length;
        centerPoint.push(searched);

        if (centerPoint[0] && centerPoint[1]) {
          this.clusterPoints.push(centerPoint);
        }
      }
    }
  }

  setAxisScales() {
    // Set up an x- and y-scale and cluster range
    this.xScale
      .range([0, this.innerWidth])
      .domain([moment().subtract(NUMBER_OF_DAYS, 'days'), moment()]);

    // Set up a y-scale between 9am and 5pm with an hour padding on both sides
    this.yScale
      .range([this.innerHeight, 0])
      .domain([
        addStartTime(moment()).subtract(1, 'hour'),
        addStartTime(moment()).add(10, 'hours')
      ]);

    // Set up the grid size
    this.clusterRange = greatestCommonDivisor(this.innerWidth, this.innerHeight);
  }

  get gTransform(): string {
    return `translate(${this.margin.left},${this.margin.top})`;
  }

  formatAxes(): AxesItem {
    return {
      xScale: this.xScale,
      yScale: this.yScale,
      height: this.innerHeight
    };
  }

  protected trackByPoint(index: number, obj: object): number {
    return index;
  }

  private draw() {
    this.updateData();
  }
}
