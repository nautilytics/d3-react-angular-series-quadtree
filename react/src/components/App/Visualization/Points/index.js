import React, {useEffect, useRef} from 'react';
import {makeStyles} from '@material-ui/core';
import {select} from "d3-selection";
import 'd3-transition';
import {DURATION} from "../../../../constant";

const useStyles = makeStyles(theme => ({
    marker: {
        stroke: 'none',
        fill: 'steelblue',
        fillOpacity: .25
    }
}));

const Points = ({points, isClustered}) => {
    const classes = useStyles();
    const pointGroupRef = useRef();

    useEffect(() => {
        if (isClustered) {
            select(pointGroupRef.current)
                .selectAll('circle')
                .transition()
                .duration(DURATION)
                .attr('cx', points[0])
                .attr('cy', points[1])
                .style('fill-opacity', 0);
        }
    }, [isClustered, points]);

    return (
        <g className="original-point-group" ref={pointGroupRef}>
            {
                points[2].map(point => {
                    const [x, y, item] = point;
                    return (
                        <circle key={item.id}
                                className={classes.marker}
                                cx={x}
                                cy={y}
                                r={item.r}/>
                    )
                })
            }
        </g>
    )
};
export default Points;
