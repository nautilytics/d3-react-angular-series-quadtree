import React from 'react';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    grid: {
        stroke: 'lightgray',
        fill: 'none'
    }
}));

const Grid = ({gridRects}) => {
    const classes = useStyles();

    return (
        <g className="grid-group">
            {
                gridRects.map((gridRect, i) => {
                    return (
                        <rect key={`grid-for-${i}`} {...gridRect} className={classes.grid}/>
                    )
                })
            }
        </g>
    )
};
export default Grid;
