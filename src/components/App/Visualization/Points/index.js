import React from 'react';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    marker: {
        stroke: 'none',
        fill: 'steelblue',
        fillOpacity: .25
    }
}));

const Points = ({points}) => {
    const classes = useStyles();

    return (
        <g className="original-point-group">
            {
                points.map(point => {
                    return (
                        <circle key={point[2].id}
                                className={classes.marker}
                                cx={point[0]}
                                cy={point[1]}
                                r={point[2].r}/>
                    )
                })
            }
        </g>
    )
};
export default Points;
