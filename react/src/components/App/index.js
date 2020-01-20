import React from 'react';
import Visualization from "./Visualization";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    App: {
        textAlign: 'center'
    }
}));

function App() {
    const classes = useStyles();

    return (
        <div className={classes.App}>
            <Visualization/>
        </div>
    );
}

export default App;
