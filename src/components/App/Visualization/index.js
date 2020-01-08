import React, {useState} from 'react';
import {range} from 'd3-array';
import {makeStyles} from '@material-ui/core';
import {greatestCommonDivisor, retrieveQuadtreeNodes, search} from "../../../utils";
import {quadtree as d3_quadtree} from "d3-quadtree";
import Grid from "./Grid";
import Points from "./Points";
import ClusterPoint from "./ClusterPoint";
import QuadTreeNode from "./QuadTreeNode";

const useStyles = makeStyles(theme => ({
    border: {
        stroke: 'black',
        fill: 'none',
    }
}));

const Visualization = () => {
    const classes = useStyles();

    // Set up some constant variables for the visualization
    const width = 1000;
    const height = 800;
    const margin = {
        left: 40,
        right: 40,
        bottom: 40,
        top: 40
    };
    const markerRadius = 10;

    // Retrieve the inner height and width for which we will be drawing on
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    // Create a random sampling of data points, useState to ensure it isn't updated during re-renders
    const [nodes] = useState(range(400).map(d => {
        return [
            Math.random() * innerWidth,
            Math.random() * innerHeight,
            {
                id: d,
                name: `name-of-${d}`,
                r: markerRadius
            }
        ];
    }));

    // Find the optimal grid size
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

    // Create cluster points
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
                <rect className={classes.border} width={innerWidth} height={innerHeight}/>
                <Points points={nodes}/>
                <g className="grid-group">
                    {
                        gridRects.map((gridRect, i) => {
                            return (
                                <Grid key={`grid-for-${i}`} rect={gridRect}/>
                            )
                        })
                    }
                </g>
                <g className="quad-tree-group" clipPath="url(#quadTreeClip)">
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
                <g className="cluster-point-group">
                    {
                        clusterPoints.map((clusterPoint, i) => {
                            return (
                                <ClusterPoint key={`cluster-point-${i}`} clusterPoint={clusterPoint}/>
                            )
                        })
                    }
                </g>
            </g>
        </svg>
    )
};
export default Visualization;
