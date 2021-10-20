import React, {Component} from 'react';
import './card.css'
import _ from "lodash"
import DragAndDrop from './../Modules/DragAndDrop'


class CartDragable extends Component {

    state = {ports: []}

    makeTable = () => {
        if (this.props.card) {
            const {textLabel, bgColor, size, url} = this.props.card;
            const textLength = "translateY(" + (textLabel ? textLabel.length : '') * 3.6 + "px)  rotate(-90deg)";
            let k = [];
            let tr = [];
            const fractionCoEf = Math.ceil(1 / size);
            const border = "border-2px" + (this.props.selected ? "-red" : "");
            for (let i = 0; i < size; i++) {
                k.push(<th key={i} style={{transform: "0px 10px 0p 0px"}}
                           className={border + " width-25 text-center"}>cart place</th>);
            }

            return <table className={"margin--1 " + border}>
                <tbody>
                <tr>
                    {k}
                </tr>
                </tbody>
            </table>
        } else {
            return null;
        }
    };

    dropPort(ev, arr, serviceId, card, num, currentPort) {
        //console.log('serviceId  : ', serviceId, 'card : ', card, 'num : ', num, 'currentPort : ', currentPort)

        ev.preventDefault();
        this.props.dragService_to_port(num, currentPort);

    }

    onClicked = (ev, id) => {
        ev.preventDefault();
        if (typeof this.props.setPrevClick === "function") {
            this.props.setPrevClick(true);
            this.props.onPortClick(id);
        }
    }

    calcDims(ports, width, height) {
        const newPorts = _.cloneDeep(ports);
        newPorts.forEach(port => {
            port.width *= width;
            port.height *= height;
            port.pos.width *= width;
            port.pos.height *= height;
        });
        return newPorts;
    }

    onMouseOver = (e) => {
        //console.log('****************', e)
    }

    render() {
        // //console.log('here is render card : ', this.props.num, this.props.card, this.props)
        return (
            this.makeTable()
        );
    }
}

export default CartDragable;