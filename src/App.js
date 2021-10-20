import './App.css';
import React from "react";
import Template from "./components/Template/Template";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import '../node_modules/react-confirm-alert/src/react-confirm-alert.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import About from "./components/About/About";

function App() {
    return (

        <Router>
            <div>
                <Switch>
                    <Route exact path="/:grooming" component={Template} />
                    {/*<Route exact path="/" component={Template}/>*/}
                    <Route path="/about" component={About} />
                    <Route path="/dashboard" />
                </Switch>
            </div>
        </Router>

    );
}

export default App;
