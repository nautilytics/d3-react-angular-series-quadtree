import React from 'react';
import Visualization from "./Visualization";
import {makeStyles} from "@material-ui/core";
import {MARKER_RADIUS} from "../../constant";

const useStyles = makeStyles(theme => ({
    App: {
        textAlign: 'center'
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '275px',
        marginTop: '-20px',
        justifyContent: 'start'
    },
    point: {
        width: MARKER_RADIUS * 2,
        height: MARKER_RADIUS * 2,
        borderRadius: '50%',
        backgroundColor: 'steelblue',
        opacity: .25,
        marginRight: '10px'
    }
}));

function App() {
    const classes = useStyles();

    return (
        <div className={classes.App}>
            <Visualization/>
            <div className={classes.wrapper}>
                <div className={classes.point}/>
                <p>Customer interaction point</p>
            </div>
        </div>
    );
}

export default App;
