import React, {useEffect, useState} from 'react';
import {range} from 'd3-array';
import {makeStyles} from '@material-ui/core';
import {
    addStartTime,
    calculateLayout,
    getRandomMinute,
    getTimeForYAxis,
    greatestCommonDivisor,
    retrieveQuadtreeNodes,
    search
} from "../../../utils";
import {quadtree as d3_quadtree} from "d3-quadtree";
import {scaleTime} from 'd3-scale';
import Grid from "./Grid";
import ClusterPoint from "./ClusterPoint";
import QuadTreeNode from "./QuadTreeNode";
import moment from 'moment';
import {DURATION, NUMBER_OF_DAYS, MARKER_RADIUS} from "../../../constant";
import Axes from "./Axes";
import ForceLayoutPoints from "./ForceLayoutPoints";

const useStyles = makeStyles(theme => ({
    border: {
        stroke: 'black',
        fill: 'none',
    }
}));

const Visualization = () => {
    const classes = useStyles();
    const [isClustered, setIsClustered] = useState(true);
    const [showGridRects] = useState(false);
    const [showQuadTreeRects] = useState(false);
    const [isForceLayout] = useState(false);

    // Set up some constant variables for the visualization
    const width = 1000;
    const height = 600;
    const margin = {
        left: 80,
        right: 40,
        bottom: 40,
        top: 80
    };
    const markerRadius = MARKER_RADIUS;

    // Retrieve the inner height and width for which we will be drawing on
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    // Set up an x- and y-scale
    const xScale = scaleTime()
        .range([0, innerWidth])
        .domain([moment().subtract(NUMBER_OF_DAYS, 'days'), moment()]);

    // Set up a y-scale between 9am and 5pm with an hour padding on both sides
    const yScale = scaleTime()
        .range([innerHeight, 0])
        .domain([
            addStartTime(moment()).subtract(1, 'hour'),
            addStartTime(moment()).add(10, 'hours')
        ]);

    // Create a random sampling of data points, useState to ensure it isn't updated during re-renders
    // Ensure that our time value falls between working hours for this example
    const [nodes] = useState(range(150).map(d => {
        const dt = addStartTime(moment()
            .subtract(Math.floor(Math.random() * NUMBER_OF_DAYS), 'days'))
            .add(Math.floor(Math.random() * 9), 'hours')
            .add(getRandomMinute(), 'minutes');
        return [
            xScale(dt),
            yScale(getTimeForYAxis(dt)),
            {
                id: d,
                name: `name-of-${d}`,
                r: markerRadius
            }
        ];
    }));

    // After n seconds, cluster the points based on the quad tree
    useEffect(() => {
        // setTimeout(() => {
        //     setIsClustered(true);
        // }, DURATION);
    }, []);

    // Calculate a grid size
    // TODO - increase this number for less cross-over amongst points
    const clusterRange = greatestCommonDivisor(innerWidth, innerHeight);

    // Create a grid of rects
    let gridRects = [];
    for (let x = 0; x < innerWidth; x += clusterRange) {
        for (let y = 0; y < innerHeight; y += clusterRange) {
            gridRects.push({
                x,
                y,
                width: clusterRange,
                height: clusterRange
            })
        }
    }

    // Create cluster points, i.e. an array of:
    // [[cluster_x, cluster_y, [points_to_cluster], ...]
    const quadtree = d3_quadtree().addAll(nodes);
    let clusterPoints = [];
    for (let x = 0; x <= innerWidth; x += clusterRange) {
        for (let y = 0; y <= innerHeight; y += clusterRange) {
            let searched = search(quadtree, x, y, x + clusterRange, y + clusterRange);

            let centerPoint = searched.reduce((prev, current) => {
                return [prev[0] + current[0], prev[1] + current[1]];
            }, [0, 0]);

            centerPoint[0] = centerPoint[0] / searched.length;
            centerPoint[1] = centerPoint[1] / searched.length;
            centerPoint.push(searched);

            if (centerPoint[0] && centerPoint[1]) {
                clusterPoints.push(centerPoint);
            }
        }
    }

    return (
        <svg width={width} height={height}>
            <clipPath id="quadTreeClip">
                <rect width={innerWidth} height={innerHeight}/>
            </clipPath>
            <g transform={`translate(${margin.left},${margin.top})`}>
                {isForceLayout && <ForceLayoutPoints
                    points={calculateLayout(nodes.map(node => ({x: node[0], y: node[1], r: markerRadius})))}/>}
                {
                    showGridRects && <g className="grid-group">
                        {
                            gridRects.map((gridRect, i) => {
                                return (
                                    <Grid key={`grid-for-${i}`} rect={gridRect}/>
                                )
                            })
                        }
                    </g>
                }
                {
                    showQuadTreeRects && <g className="quad-tree-group" clipPath="url(#quadTreeClip)">
                        {
                            retrieveQuadtreeNodes(quadtree).map((node, i) => {
                                return (
                                    <QuadTreeNode key={`quad-tree-node-${i}`}
                                                  rect={{
                                                      x: node.x0,
                                                      y: node.y0,
                                                      width: node.y1 - node.y0,
                                                      height: node.x1 - node.x0
                                                  }}/>
                                )
                            })
                        }
                    </g>
                }
                {!isForceLayout && <g className="cluster-point-group">
                    {
                        clusterPoints.map((clusterPoint, i) => {
                            return (
                                <ClusterPoint key={`cluster-point-${i}`} clusterPoint={clusterPoint}
                                              isClustered={isClustered}/>
                            )
                        })
                    }
                </g>}
                <Axes height={innerHeight} xScale={xScale} yScale={yScale}/>
            </g>
        </svg>
    )
};
export default Visualization;
