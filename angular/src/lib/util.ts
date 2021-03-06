import * as moment from 'moment';

export const greatestCommonDivisor = (x: number, y: number): number => {
  // Return the greatest common divisor of two points
  if ((typeof x !== 'number') || (typeof y !== 'number'))
    return 0;
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    let t = y;
    y = x % y;
    x = t;
  }
  return x;
};

export const search = (quadtree: any, x0: number, y0: number, x3: number, y3: number): any[] => {
  // Find the nodes within the specified rectangle.
  // Inspired by https://bl.ocks.org/mbostock/4343214
  let validData = [];
  quadtree.visit((node, x1, y1, x2, y2) => {
    if (!node.length) {
      do {
        const d = node.data;
        d.scanned = true;
        if ((d[0] >= x0) && (d[0] < x3) && (d[1] >= y0) && (d[1] < y3)) {
          validData.push(d);
        }
      } while (node = node.next);
    }
    return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
  });
  return validData;
};

export const getTimeForYAxis = (dt: any): any =>
  moment()
    .startOf('day')
    .add(dt.format('HH'), 'hours')
    .add(dt.format('mm'), 'minutes');
export const addStartTime = dt => dt.startOf('day').add(8, 'hours');
export const getRandomMinute = (): number => Math.floor(Math.random() * 60);
