export const greatestCommonDivisor = (x, y) => {
    // Return the greatest common divisor of two points
    if ((typeof x !== 'number') || (typeof y !== 'number'))
        return false;
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
        let t = y;
        y = x % y;
        x = t;
    }
    return x;
};

export const search = (quadtree, x0, y0, x3, y3) => {
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

export const retrieveQuadtreeNodes = quadtree => {
    // Collapse the quadtree into an array of rectangles.
    // Inspired by https://bl.ocks.org/mbostock/4343214
    let nodes = [];
    quadtree.visit((node, x0, y0, x1, y1) => {
        node.x0 = x0;
        node.y0 = y0;
        node.x1 = x1;
        node.y1 = y1;
        nodes.push(node);
    });
    return nodes;
};
