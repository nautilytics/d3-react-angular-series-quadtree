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
    // const [nodes] = useState(range(150).map(d => {
    //     const dt = addStartTime(moment()
    //         .subtract(parseInt(Math.random() * NUMBER_OF_DAYS, 10), 'days'))
    //         .add(parseInt(Math.random() * 9, 10), 'hours')
    //         .add(getRandomMinute(), 'minutes');
    //     return [
    //         xScale(dt),
    //         yScale(getTimeForYAxis(dt)),
    //         {
    //             id: d,
    //             name: `name-of-${d}`,
    //             r: markerRadius
    //         }
    //     ];
    // }));
    const [nodes] = useState([[873.7659954665705,284.3636363636364,{"id":0,"name":"name-of-0","r":10}],[90.2909959199705,81.45454545454544,{"id":1,"name":"name-of-1","r":10}],[35.10766261857196,347.6363636363636,{"id":2,"name":"name-of-2","r":10}],[353.1909957678293,107.63636363636364,{"id":3,"name":"name-of-3","r":10}],[742.7132177646336,261.8181818181818,{"id":4,"name":"name-of-4","r":10}],[163.9298847662443,423.27272727272725,{"id":5,"name":"name-of-5","r":10}],[560.0826623147669,419.6363636363636,{"id":6,"name":"name-of-6","r":10}],[696.0854400138395,324.3636363636364,{"id":7,"name":"name-of-7","r":10}],[612.7909956175978,212.36363636363635,{"id":8,"name":"name-of-8","r":10}],[609.1548845085908,298.90909090909093,{"id":9,"name":"name-of-9","r":10}],[837.5271065986533,99.63636363636361,{"id":10,"name":"name-of-10","r":10}],[660.365995590066,127.27272727272727,{"id":11,"name":"name-of-11","r":10}],[168.11599587493288,323.6363636363637,{"id":12,"name":"name-of-12","r":10}],[531.0243289982499,63.999999999999986,{"id":13,"name":"name-of-13","r":10}],[342.8937735515661,352.72727272727275,{"id":14,"name":"name-of-14","r":10}],[265.2826624853688,105.45454545454547,{"id":15,"name":"name-of-15","r":10}],[395.8465512986999,139.63636363636363,{"id":16,"name":"name-of-16","r":10}],[265.6187735962854,97.45454545454544,{"id":17,"name":"name-of-17","r":10}],[437.7687734966616,189.0909090909091,{"id":18,"name":"name-of-18","r":10}],[835.663217710843,144.00000000000003,{"id":19,"name":"name-of-19","r":10}],[131.38821811840958,150.54545454545453,{"id":20,"name":"name-of-20","r":10}],[823.4715510512318,434.1818181818182,{"id":21,"name":"name-of-21","r":10}],[430.4659957231099,362.90909090909093,{"id":22,"name":"name-of-22","r":10}],[658.7465511465588,165.8181818181818,{"id":23,"name":"name-of-23","r":10}],[652.9715511499007,303.27272727272725,{"id":24,"name":"name-of-24","r":10}],[525.677106779122,191.27272727272725,{"id":25,"name":"name-of-25","r":10}],[609.0326622864394,301.8181818181818,{"id":26,"name":"name-of-26","r":10}],[262.86877359787684,162.90909090909088,{"id":27,"name":"name-of-27","r":10}],[794.779884401169,69.81818181818184,{"id":28,"name":"name-of-28","r":10}],[307.81599579408794,140.36363636363637,{"id":29,"name":"name-of-29","r":10}],[440.82432905044885,116.36363636363637,{"id":30,"name":"name-of-30","r":10}],[264.8548847078386,115.63636363636365,{"id":31,"name":"name-of-31","r":10}],[831.2632177133894,248.72727272727272,{"id":32,"name":"name-of-32","r":10}],[793.2826621798133,105.45454545454547,{"id":33,"name":"name-of-33","r":10}],[437.3104401635935,199.99999999999997,{"id":34,"name":"name-of-34","r":10}],[481.7382179156608,189.81818181818184,{"id":35,"name":"name-of-35","r":10}],[871.6882176899952,333.8181818181818,{"id":36,"name":"name-of-36","r":10}],[479.7215512501611,237.81818181818184,{"id":37,"name":"name-of-37","r":10}],[870.1909954686395,369.45454545454544,{"id":38,"name":"name-of-38","r":10}],[650.9243289288632,352,{"id":39,"name":"name-of-39","r":10}],[437.8604401632752,186.9090909090909,{"id":40,"name":"name-of-40","r":10}],[659.388217812854,150.54545454545453,{"id":41,"name":"name-of-41","r":10}],[693.2743289043551,391.2727272727273,{"id":42,"name":"name-of-42","r":10}],[836.3659954882141,127.27272727272727,{"id":43,"name":"name-of-43","r":10}],[660.3048844789903,128.72727272727272,{"id":44,"name":"name-of-44","r":10}],[351.5104402132463,147.63636363636365,{"id":45,"name":"name-of-45","r":10}],[707.8493288959205,44.36363636363636,{"id":46,"name":"name-of-46","r":10}],[166.12988476497114,370.9090909090909,{"id":47,"name":"name-of-47","r":10}],[209.70210696197793,381.0909090909091,{"id":48,"name":"name-of-48","r":10}],[163.74655143301706,427.6363636363636,{"id":49,"name":"name-of-49","r":10}],[208.63266251815242,406.5454545454545,{"id":50,"name":"name-of-50","r":10}],[699.9659955671493,231.99999999999997,{"id":51,"name":"name-of-51","r":10}],[875.2937732434642,247.99999999999997,{"id":52,"name":"name-of-52","r":10}],[608.8798845087501,305.45454545454544,{"id":53,"name":"name-of-53","r":10}],[44.45766261316108,125.0909090909091,{"id":54,"name":"name-of-54","r":10}],[87.32710703279682,152,{"id":55,"name":"name-of-55","r":10}],[787.1409955167007,251.6363636363636,{"id":56,"name":"name-of-56","r":10}],[735.5326622132334,432.7272727272727,{"id":57,"name":"name-of-57","r":10}],[440.70210682829736,119.2727272727273,{"id":58,"name":"name-of-58","r":10}],[881.4354399065767,101.81818181818184,{"id":59,"name":"name-of-59","r":10}],[826.1909954941024,369.45454545454544,{"id":60,"name":"name-of-60","r":10}],[165.94655143174387,375.2727272727273,{"id":61,"name":"name-of-61","r":10}],[171.2326625397959,249.4545454545455,{"id":62,"name":"name-of-62","r":10}],[834.1048843784115,181.09090909090912,{"id":63,"name":"name-of-63","r":10}],[41.615995948138895,192.72727272727272,{"id":64,"name":"name-of-64","r":10}],[301.52155135328616,290.18181818181813,{"id":65,"name":"name-of-65","r":10}],[701.4937733440429,195.63636363636365,{"id":66,"name":"name-of-66","r":10}],[649.8548844850377,377.45454545454544,{"id":67,"name":"name-of-67","r":10}],[517.4882178949721,386.1818181818182,{"id":68,"name":"name-of-68","r":10}],[560.7854400921381,402.9090909090909,{"id":69,"name":"name-of-69","r":10}],[569.9826623090379,184,{"id":70,"name":"name-of-70","r":10}],[173.64655142728787,192,{"id":71,"name":"name-of-71","r":10}],[875.9354399097597,232.72727272727275,{"id":72,"name":"name-of-72","r":10}],[829.0021066035868,302.54545454545456,{"id":73,"name":"name-of-73","r":10}],[164.32710698823664,413.8181818181818,{"id":74,"name":"name-of-74","r":10}],[46.50488483419856,76.36363636363635,{"id":75,"name":"name-of-75","r":10}],[526.4715512231068,172.36363636363637,{"id":76,"name":"name-of-76","r":10}],[304.6993291292249,214.54545454545456,{"id":77,"name":"name-of-77","r":10}],[387.1076624148683,347.6363636363636,{"id":78,"name":"name-of-78","r":10}],[659.5104400350056,147.63636363636365,{"id":79,"name":"name-of-79","r":10}],[692.9382177934385,399.27272727272725,{"id":80,"name":"name-of-80","r":10}],[742.6521066535578,263.27272727272725,{"id":81,"name":"name-of-81","r":10}],[528.9771067772123,112.72727272727273,{"id":82,"name":"name-of-82","r":10}],[486.8104401349476,69.09090909090908,{"id":83,"name":"name-of-83","r":10}],[474.37432903103337,365.0909090909091,{"id":84,"name":"name-of-84","r":10}],[173.4937736495985,195.63636363636365,{"id":85,"name":"name-of-85","r":10}],[743.7215510973833,237.81818181818184,{"id":86,"name":"name-of-86","r":10}],[477.9493290289645,279.99999999999994,{"id":87,"name":"name-of-87","r":10}],[617.2215511705894,106.90909090909093,{"id":88,"name":"name-of-88","r":10}],[295.6854402455524,429.09090909090907,{"id":89,"name":"name-of-89","r":10}],[308.1826624605424,131.63636363636365,{"id":90,"name":"name-of-90","r":10}],[177.43544031398412,101.81818181818184,{"id":91,"name":"name-of-91","r":10}],[703.7548844538455,141.8181818181818,{"id":92,"name":"name-of-92","r":10}],[135.2076625606437,59.63636363636365,{"id":93,"name":"name-of-93","r":10}],[787.2632177388523,248.72727272727272,{"id":94,"name":"name-of-94","r":10}],[167.47432920863756,338.9090909090909,{"id":95,"name":"name-of-95","r":10}],[389.79655130220107,283.6363636363636,{"id":96,"name":"name-of-96","r":10}],[567.049328977402,253.8181818181818,{"id":97,"name":"name-of-97","r":10}],[210.52710696150052,361.45454545454544,{"id":98,"name":"name-of-98","r":10}],[297.6409957999763,382.54545454545456,{"id":99,"name":"name-of-99","r":10}],[747.6021066506933,145.45454545454544,{"id":100,"name":"name-of-100","r":10}],[31.440995954027198,434.9090909090909,{"id":101,"name":"name-of-101","r":10}],[34.09932928582215,371.6363636363636,{"id":102,"name":"name-of-102","r":10}],[298.19099579965797,369.45454545454544,{"id":103,"name":"name-of-103","r":10}],[179.3604403128701,56.000000000000014,{"id":104,"name":"name-of-104","r":10}],[824.2965510507544,414.54545454545456,{"id":105,"name":"name-of-105","r":10}],[43.72432928025212,142.54545454545456,{"id":106,"name":"name-of-106","r":10}],[560.0521067592291,420.3636363636364,{"id":107,"name":"name-of-107","r":10}],[520.9715512262895,303.27272727272725,{"id":108,"name":"name-of-108","r":10}],[741.4909955431186,290.90909090909093,{"id":109,"name":"name-of-109","r":10}],[790.1048844038745,181.09090909090912,{"id":110,"name":"name-of-110","r":10}],[86.92988481080447,161.45454545454544,{"id":111,"name":"name-of-111","r":10}],[744.4854399858302,219.63636363636363,{"id":112,"name":"name-of-112","r":10}],[476.23821791884365,320.72727272727275,{"id":113,"name":"name-of-113","r":10}],[75.96044037270808,422.54545454545456,{"id":114,"name":"name-of-114","r":10}],[32.29655150908764,414.54545454545456,{"id":115,"name":"name-of-115","r":10}],[256.1465513795448,322.90909090909093,{"id":116,"name":"name-of-116","r":10}],[387.5965513034742,336,{"id":117,"name":"name-of-117","r":10}],[223.23821806525567,58.90909090909089,{"id":118,"name":"name-of-118","r":10}],[302.9576624635661,256,{"id":119,"name":"name-of-119","r":10}],[782.6798844081713,357.8181818181818,{"id":120,"name":"name-of-120","r":10}],[36.14655150685964,322.90909090909093,{"id":121,"name":"name-of-121","r":10}],[567.8437734213867,234.9090909090909,{"id":122,"name":"name-of-122","r":10}],[748.854884427746,115.63636363636365,{"id":123,"name":"name-of-123","r":10}],[783.6576621853833,334.54545454545456,{"id":124,"name":"name-of-124","r":10}],[520.0243290046155,325.81818181818176,{"id":125,"name":"name-of-125","r":10}],[519.6576623381611,334.54545454545456,{"id":126,"name":"name-of-126","r":10}],[482.5326623596455,170.9090909090909,{"id":127,"name":"name-of-127","r":10}],[308.2437735716182,130.1818181818182,{"id":128,"name":"name-of-128","r":10}],[750.9937733153971,64.72727272727275,{"id":129,"name":"name-of-129","r":10}],[877.1271065757367,204.36363636363637,{"id":130,"name":"name-of-130","r":10}],[483.1743290259408,155.63636363636363,{"id":131,"name":"name-of-131","r":10}],[872.1159954675254,323.6363636363637,{"id":132,"name":"name-of-132","r":10}],[870.4048843574045,364.3636363636363,{"id":133,"name":"name-of-133","r":10}],[872.8187732448965,306.90909090909093,{"id":134,"name":"name-of-134","r":10}],[349.15766243683004,203.63636363636363,{"id":135,"name":"name-of-135","r":10}],[699.2326622342404,249.4545454545455,{"id":136,"name":"name-of-136","r":10}],[442.5965512716455,74.18181818181819,{"id":137,"name":"name-of-137","r":10}],[120.72432923569194,404.3636363636364,{"id":138,"name":"name-of-138","r":10}],[46.718773722963675,71.27272727272725,{"id":139,"name":"name-of-139","r":10}],[84.42432925669888,221.09090909090907,{"id":140,"name":"name-of-140","r":10}],[515.6243290071618,430.54545454545456,{"id":141,"name":"name-of-141","r":10}],[223.60488473171014,50.18181818181816,{"id":142,"name":"name-of-142","r":10}],[45.16044039053215,108.36363636363635,{"id":143,"name":"name-of-143","r":10}],[654.0409955937263,277.81818181818187,{"id":144,"name":"name-of-144","r":10}],[738.4965511004071,362.1818181818182,{"id":145,"name":"name-of-145","r":10}],[38.28544039451074,272,{"id":146,"name":"name-of-146","r":10}],[738.0687733228768,372.3636363636364,{"id":147,"name":"name-of-147","r":10}],[171.78266253947763,236.36363636363637,{"id":148,"name":"name-of-148","r":10}],[530.1076623321136,85.81818181818184,{"id":149,"name":"name-of-149","r":10}]]);
    // console.log(JSON.stringify(nodes));

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
