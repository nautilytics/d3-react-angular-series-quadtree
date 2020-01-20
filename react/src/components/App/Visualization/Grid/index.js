import React from 'react';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    grid: {
        stroke: 'lightgray',
        fill: 'none'
    }
}));

const Grid = ({rect}) => {
    const classes = useStyles();

    return (
        <rect {...rect} className={classes.grid}/>
    );
};
export default Grid;
