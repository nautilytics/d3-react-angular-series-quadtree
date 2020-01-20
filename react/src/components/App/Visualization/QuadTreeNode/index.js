import React from 'react';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    quadtree: {
        stroke: 'rgba(75,75,75,0.99)',
        fill: 'none'
    }
}));

const QuadTreeNode = ({rect}) => {
    const classes = useStyles();

    return (
        <rect {...rect} className={classes.quadtree}/>
    );
};
export default QuadTreeNode;
