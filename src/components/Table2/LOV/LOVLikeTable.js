import React, {PureComponent} from 'react';
import './LOV.css'
import OutsideAlerter from './../OutSideClick/OutsideAlerter'
import axios from "axios";
import config from "../../../config";
import ShowTable from './../ShowTable/ShowTable'
import PopUpFixed from './../Popup/PopUpFixed'

class LOVLikeTable extends PureComponent {


    constructor(props) {
        super(props);

    }

    state = {
        flagShow: true

    }

    closePopup = () => {
        this.setState({
            flagShow: false
        })
    }


    render() {
        return (
            <>
                <PopUpFixed closePopup={this.closePopup} >
                    <ShowTable/>
                </PopUpFixed>
            </>
        );
    }
}

export default LOVLikeTable;
