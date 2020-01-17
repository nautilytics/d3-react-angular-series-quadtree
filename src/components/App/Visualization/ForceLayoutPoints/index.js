import React from 'react';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    marker: {
        stroke: 'none',
        fill: 'steelblue',
        fillOpacity: .25
    }
}));

const ForceLayoutPoints = ({points}) => {
    const classes = useStyles();

    return (
        <g className="force-layout-point-group">
            {
                points.map((point, idx) => {
                    const {x, y, r} = point;
                    return (
                        <circle key={`point-for-${idx}`}
                                className={classes.marker}
                                cx={x}
                                cy={y}
                                r={r}/>
                    )
                })
            }
        </g>
    )
};
export default ForceLayoutPoints;
