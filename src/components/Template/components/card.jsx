import React, { Component } from 'react';
import './card.css'
import './toolTip.css'
import _, { functions } from "lodash"
import DragAndDrop from './../Modules/DragAndDrop'
import DeleteIcon from '@material-ui/icons/Delete'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AdbIcon from '@material-ui/icons/Adb';
import TouchAppOutlined from '@material-ui/icons/TouchAppOutlined';
import { capacity } from "../../../utils/trafficUtil/trafficUtil";
import { confirmAlert } from 'react-confirm-alert';

class Card extends Component {
    state = { ports: [], flagPort: false, currentPort: null, flag: false, info: [], Groomout_capcity: 0, lightpath_cap: 0 };

    constructor(props) {
        super(props);
    }


    //Confirm Delete
    confirmDelete = (ev, num, id, selectedCurrentService, port, card, groomout_id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h1 className="title">Are you sure?</h1>
                        <p className="disc">You want to delete this Service?</p>
                        <div className="btns">
                            <button className="_btn btnClose" onClick={onClose}>No</button>
                            <button className="_btn btnyes"
                                onClick={() => {
                                    this.deleteService_of_port(ev,
                                        num,
                                        id,
                                        selectedCurrentService,
                                        port,
                                        card,
                                        groomout_id,
                                    );
                                    onClose();
                                }}
                            >
                                Yes, Delete it!
                            </button>
                        </div>
                    </div>
                );
            },
            closeOnEscape: true,
            closeOnClickOutside: true
        });
    }

    connectionCarts = () => {
        let current_traffic = {};
        let demand_id_current_traffic = 0;
        let service_id_list_current_traffic = {};
        let capcity_lightPath = 0;
        let GroomOuts_id = [];
        let GroomOuts_mp2x_panel_address = [];

        if (this.props.traffic) {
            if (this.props.traffic.main) {
                if (this.props.traffic.main.lightpaths) {
                    //get Current_traffic of lightPath
                    current_traffic = this.props.traffic.main.lightpaths[this.props.elem.lightpathId];
                    // //console.log("current_traffic__", current_traffic);
                    if (current_traffic) {
                        demand_id_current_traffic = current_traffic.demand_id;
                        service_id_list_current_traffic = current_traffic.service_id_list;
                        //console.log("current_traffic_service", service_id_list_current_traffic);
                        for (let i in service_id_list_current_traffic) {
                            let Service_id = service_id_list_current_traffic[i].id;
                            let type = service_id_list_current_traffic[i].type;
                            if (type === "normal") {
                                let serviceType = service_id_list_current_traffic[i].serviceType;
                                capcity_lightPath = capcity_lightPath + capacity(`${serviceType}`, 'null');
                            }
                            else {
                                GroomOuts_id.push(service_id_list_current_traffic[i].id);
                                //console.log("current_traffic_GroomOuts_id", GroomOuts_id);
                                GroomOuts_mp2x_panel_address.push(service_id_list_current_traffic[i].mp2x_panel_address);
                            }

                        }
                        let sum_groomouts = 0;
                        for (let i in GroomOuts_id) {
                            let cap_groomout = this.getGroomout_capcity(demand_id_current_traffic, GroomOuts_id[i]);
                            // this.setState.Groomout_capcity = this.cap_groomout;
                            this.state.Groomout_capcity = cap_groomout;
                            sum_groomouts = sum_groomouts + capacity("groomout", cap_groomout);
                            //console.log("current_traffic_groomout", i, GroomOuts_id[i], cap_groomout, sum_groomouts);
                        }
                        capcity_lightPath = capcity_lightPath + sum_groomouts;
                        this.state.lightpath_cap = capcity_lightPath;
                    }
                }
            }
        }

        // //console.log('8888', this.props.card,  this.props.elem, this.props.elem.lightpathId, current_traffic);
        let info = [];
        if (current_traffic) {

            if (current_traffic.service_id_list) {
                current_traffic.service_id_list.map((row, index) => {
                    if (row.type === 'groomout') {
                        // //console.log("row.mp2x_panel_address",row.mp2x_panel_address, this.props.num);
                        info.push(row.mp2x_panel_address);
                    }
                });
            }
            this.state.info = info;
        }
        //console.log('***current_traffic***', current_traffic)
        //console.log("props.cardd", this.props.card.textLabel);
        return info;
    };

    makeTable = () => {
        //محاسبه ی کارت های متصل به lightpath
        let info = this.connectionCarts();
        //*****************************************
        if (this.props.card) {
            const { textLabel, bgColor, size, url } = this.props.card;
            const textLength = "translateY(" + (textLabel ? textLabel.length : '') * 3.6 + "px)  rotate(-90deg)";
            let k = [];
            let tr = [];
            const fractionCoEf = Math.ceil(1 / size);
            const border = "border-2px" + (this.props.selected ? "-red" : "");
            for (let i = 0; i < size; i++) {
                k.push(<th key={i} style={{ transform: "0px 10px 0p 0px" }}
                    className={border + " width-25 text-center"}>{this.props.num + Math.ceil(size) - i - 1}</th>);
            }


            for (let i = 0; i < Math.ceil(1 / size); i++) {

                const width = 55 * Math.ceil(size);
                const height = 300 / fractionCoEf - 5;
                tr.push(<tr key={this.props.num + i} id={this.props.num}>
                    <td colSpan={size}
                        className={"text-nowrap width-25 " + border + "-top height-" + 250 / fractionCoEf}>
                        <div key={`cart${this.props.num}`} style={{ position: "relative" }}>
                            {console.log("this.props.num", this.props.num)}
                            <img src={url} width={width} height={height} alt={textLabel} />
                            {this.makeButtons(width, height)}
                            {this.makeButtons2(width, height)}
                            {this.makeButtons3(width, height, this.props.num)}
                            {this.makeButtons4(width, height, this.props.num, info)}
                        </div>
                    </td>
                </tr>);
            }

            return <table className={"margin--1 " + border}>
                <tbody>
                    <tr>
                        {k}
                    </tr>
                    {/*<tr>*/}
                    {tr}
                    {/*<td colSpan={Math.ceil(size)} className={"width-25 border-2px text-nowrap height-" + 50/Math.ceil(1/size)} style={*/}
                    {/*    {*/}
                    {/*        backgroundColor: bgColor,*/}
                    {/*    }*/}
                    {/*}>{<section style={{transform: textLength}}>{textLabel}</section>}</td>*/}
                    {/*</tr>*/}
                </tbody>
            </table>
        } else {
            return null;
        }
    };

    dropPort(ev, arr, serviceId, card, num, currentPort, groomout_id) {

        ev.preventDefault();
        //console.log('****drop****', arr, serviceId, card, num, currentPort);
        this.props.dragService_to_port(num, currentPort, serviceId, card, groomout_id);
    }

    deleteService_of_port = (ev, num, currentPort, serviceId, port, card, groomout_id, groomout_capacity) => {
        //console.log('deleteService_of_port', ev.target, num, currentPort, serviceId, port.serviceId, card, groomout_id, groomout_capacity);


        this.props.deleteService_from_port(num, currentPort, serviceId, port.serviceId, card, port, groomout_id, this.setState.groomout_capacity);
    };

    //ساختن ports
    makeButtons = (width, height) => {
        // //console.log('*******', this.props.card)
        if (typeof this.props.card.ports !== "undefined") {
            // //console.log('card is : ', this.props.card);
            const ports = this.calcDims(this.props.card.ports, width, height);
            this.state.ports = ports;
            return this.state.ports.map(port => {
                //console.log("port is:::", port);
                const butBorder = port.connected === this.props.enums.notConnected ? "button--black--border" :
                    port.connected === this.props.enums.pending ? "button--red--border" : "button--green--border";
                return <>
                    {console.log("dropPort", port, this.props.selectedCurrentService, this.props.card, this.props.num, port.id, this.props.groomout_id)}
                    <button
                        onDrop={(ev) => this.dropPort(ev, port, this.props.selectedCurrentService, this.props.card, this.props.num, port.id, this.props.groomout_id)}
                        key={port.id}
                        type="button" onClick={(ev) => this.onClicked(ev, port.id)}
                        className={"mp2xP--button " + butBorder} style={{
                            width: port.width, height: port.height,
                            transform: "translate(" + (port.pos.width - width) + "px, " + port.pos.height + "px)"
                        }}>
                    </button>

                </>
            });
        }
    }

    //ساختن سطل زباله و حذف سرویس
    makeButtons2 = (width, height) => {
        if (typeof this.props.card.ports !== "undefined") {
            const ports = this.calcDims(this.props.card.ports, width, height);
            this.state.ports = ports;
            // //console.log(` ${this.props.num} cards  is : `, ports);
            return this.state.ports.map(port => {
                let height = port.pos.height - 10;
                if (this.state[`flagPort${port.id}`]) {
                    if (port.connected == this.props.enums.connected) {

                    }
                }
                return <DeleteIcon id={port.id} color="secondary"
                    key={port.id}
                    onClick={(ev) => this.confirmDelete(ev, this.props.num, port.id, this.props.selectedCurrentService, port, this.props.card, this.props.groomout_id)}
                    type="button"
                    className={"mp2xP--button"}
                    style={{
                        display: `${port.connected === this.props.enums.connected ? '' : 'none'}`,
                        width: port.width, height: (port.height),
                        transform: "translate(" + (port.pos.width - width - 10) + "px, " + height + "px)"
                    }}>

                </DeleteIcon>
            });
        }
    };

    //hamidi
    getCapacityGrooming(groomingId) {
        let demands = this.props.traffic.main.low_rate_grooming_result.demands;
        let selectedGroomOuts;

        for (let i in demands) {
            if (demands[i].groomouts[groomingId]) {
                selectedGroomOuts = demands[i].groomouts[groomingId];
                let capacity_groom = selectedGroomOuts.capacity;
                //console.log("traffic_devices is :", selectedGroomOuts.capacity);
                return capacity_groom;
            }

        }
    }

    GetGroomputOutput() {
        let ID = '55b72dd3cafb473e9cd5e2634c134240';
        let service_devices = this.props.service_devices;
        //console.log("service_devices:", service_devices);
        let MP2X_Line1;
        let MP2X_Line2;

        for (let i in service_devices) {
            MP2X_Line1 = service_devices[i].line1;
            //console.log("MP2X_Line1", MP2X_Line1);
            MP2X_Line2 = service_devices[i].line2;
            //console.log("MP2X_Line1", MP2X_Line2);
            if (MP2X_Line1.groomout_id === ID) {
                return ["Line1", this.getCapacityGrooming(ID)];
            }

            if (MP2X_Line2.groomout_id === ID) {
                return ["Line2", this.getCapacityGrooming(ID)];
            }
        }

        // if(MP2X_Line1)
        // {
        //     let demand_id = MP2X_Line1.demand_id;
        //     capLine1= this.getGroomout_capcity(`${demand_id}`,`${groomout_id}`);
        //     //console.log("capLine1:",capLine1);
        // }

        // if(MP2X_Line2)
        // {
        //     let demand_id = MP2X_Line2.demand_id;
        //     capLine2= this.getGroomout_capcity(`${demand_id}`,`${groomout_id}`);
        //     //console.log("capLine2:",capLine2);
        // }
    }
    //tooltip port
    makeButtons3 = (width, height, num) => {
        let current_GroomOutId = [];
        let capLine1;
        let capLine2;

        // let ID = 'fd5d03dead4149db8dab2e9b1a4bb4eb';
        let service_devices = this.props.service_devices;
        //console.log("wholeArray", service_devices);
        // let wholeArray = Object.keys(service_devices).map(key => service_devices[key]);

        // //console.log("wholeArray",wholeArray);
        // //console.log("service_devices:",service_devices);
        let MP2X_Line1;
        let MP2X_Line2;

        for (let i in service_devices) {
            MP2X_Line1 = service_devices[i].line1;
            //console.log("MP2X_Line1", MP2X_Line1);
            if (MP2X_Line1) {
                let wholeArray = Object.keys(MP2X_Line1).map(key => MP2X_Line1[key]);
                if (wholeArray[0] == this.props.elem.groomout_id) {
                    capLine1 = this.getCapacityGrooming(this.props.elem.groomout_id)
                    //console.log("capLine1", capLine1);
                }
            }

            MP2X_Line2 = service_devices[i].line2;
            if (MP2X_Line2) {
                let wholeArray = Object.keys(MP2X_Line2).map(key => MP2X_Line2[key]);
                if (wholeArray[0] == this.props.elem.groomout_id) {
                    capLine2 = this.getCapacityGrooming(this.props.elem.groomout_id)
                    //console.log("capLine2", capLine2);
                }
            }
        }

        if (typeof this.props.card.ports !== "undefined") {
            const ports = this.calcDims(this.props.card.ports, width, height);
            this.state.ports = ports;
            return this.state.ports.map(port => {
                //console.log('makeButtons3', ports);
                let serviceType = 'lightpath';
                if (this.props.elem.ports) {
                    if (this.props.elem.ports[port.id - 1]) {
                        if (this.props.elem.ports[port.id - 1].serviceId) {
                            //console.log('port 88788 is : ', port, this.props.elem.ports[port.id].serviceId);
                            if (this.props.elem.ports[port.id - 1].serviceId.type) {
                                serviceType = this.props.elem.ports[port.id - 1].serviceId.type
                            }
                            if (this.props.elem.ports[port.id - 1].serviceId.serviceType) {
                                serviceType = this.props.elem.ports[port.id - 1].serviceId.serviceType
                            }
                        }

                    } else {

                    }
                }

                //hamidi
                let cap;
                if (serviceType === 'groomout') {
                    cap = capacity(serviceType, this.state.Groomout_capcity);
                    serviceType = serviceType;
                }
                else {
                    cap = capacity(serviceType, 'null');
                    serviceType = serviceType;
                }

                if (port.id === 11 && (this.props.card.textLabel === 'MP1H')) {
                    cap = this.state.lightpath_cap;
                }

                if (port.id === 11 && (this.props.card.textLabel === 'TP1H')) {
                    cap = this.state.lightpath_cap;
                }


                //capacity OutPut MP2X
                //get Current_traffic of MP2X Card
                let CardItems = this.props.CardItems;
                for (let i in CardItems) {
                    current_GroomOutId = CardItems[i].groomout_id;
                }
                //Line 1 Fro MP2X

                if (port.id === 17 && (this.props.card.textLabel === "MP2X") && port.Rx === "Line1,Rx") {
                    serviceType = 'groomOut';

                    cap = capLine1;
                    //console.log("this.props.elemthis.props.elem", cap);
                }

                //Line 2 Fro MP2X
                if (port.id === 18 && (this.props.card.textLabel === "MP2X") && port.Rx === "Line2,Rx") {
                    cap = capLine2;
                    serviceType = 'groomOut';
                    // if (this.props.elem.capacity) {
                    //     cap = this.props.elem.capacity;
                    //     //console.log("capp", cap);
                    // }
                }

                let height = port.pos.height + 5;
                if (this.state[`flagPort${port.id}`]) {
                    if (port.connected == this.props.enums.connected) {
                        //console.log("flagPort", this.props.enums.connected);
                    }
                }

                return <>
                    <ExitToAppIcon
                        key={'tooltip' + port.id}
                        id={'tooltip' + port.id}
                        type="button"
                        onMouseOver={(e) => {
                            this.onMouseOverPortToolTip(e, port.id, num)
                        }}
                        onMouseOut={(e) => {
                            this.onMouseOutPort(e, port.id, num)
                        }}
                        onClick={(ev) => this.deleteService_of_port(ev, this.props.num, port.id, this.props.selectedCurrentService, port, this.props.card, this.props.groomout_id)}
                        className={"mp2xP--button "}
                        style={{
                            display: `${port.connected === this.props.enums.connected || (port.id === 11 && (this.props.card.textLabel === 'MP1H' || this.props.card.textLabel === 'TP1H')) || ((port.id === 17 && this.props.card.textLabel === 'MP2X') || (port.id === 18 && this.props.card.textLabel === 'MP2X')) ? '' : 'none'}`,
                            width: port.width, height: port.height,
                            transform: "translate(" + (port.pos.width - width + 8) + "px, " + height + "px)"
                        }}>

                    </ExitToAppIcon>

                    {port.id % 2 === 0 ? <span className={`mp2xP--button tooltipHidden`}
                        key={num + 'tooltipD' + port.id}
                        id={num + 'tooltipD' + port.id}
                        style={{
                            backgroundColor: "black",
                            color: "#fff",
                            marginLeft: '20px', borderRadius: "0px", padding: "5px",
                            transform: "translate(" + (port.pos.width - width) + "px, " + port.pos.height + "px)"
                        }}
                    >{`source -> destination :  ${this.props.elem.source}  -> ${this.props.elem.destination} , type : ${serviceType}, cap : ${cap}`}  </span>
                        :
                        <span className={`mp2xP--button tooltipHidden`}
                            key={num + 'tooltipD' + port.id}
                            id={num + 'tooltipD' + port.id}
                            style={{
                                backgroundColor: "black",
                                color: "#fff", marginTop: '-25px', borderRadius: "4px", padding: "5px",
                                transform: "translate(" + (port.pos.width - width) + "px, " + port.pos.height + "px)"
                            }}
                        >{`source -> destination :   ${this.props.elem.source}  -> ${this.props.elem.destination} , type : ${serviceType} , cap : ${cap}`} </span>}


                </>

            });
        }
    };

    //tooltip cart
    makeButtons4 = (width, height, num, info) => {
        // //console.log('**********', this.props.card, this.props.elem);
        if (typeof this.props.card.ports !== "undefined") {
            let height2 = 0;

            return <>
                <TouchAppOutlined
                    key={'tooltipCart' + num}
                    id={'tooltipCart' + num}
                    type="button"
                    onMouseOver={(e) => {
                        this.onMouseOverCartToolTip(e, num)
                    }}
                    onMouseOut={(e) => {
                        this.onMouseOutCart(e, num)
                    }}

                    className={"mp2xP--button "}
                    style={{
                        width: 30, height: 25,
                        transform: "translate(" + -25 + "px, " + height2 + "px)"
                    }}>
                </TouchAppOutlined>
                <div className={`mp2xP--button tooltipHidden`}
                    key={num + 'tooltipCartD'}
                    id={num + 'tooltipCartD'}
                    style={{

                        display: "unset",
                        // whiteSpace: "break-spaces",
                        backgroundColor: "black",
                        color: "#fff", marginTop: '-25px', borderRadius: "4px", padding: "5px",
                        index: '100',
                        transform: "translate(" + -120 + "px, " + 40 + "px)"
                    }}
                >{`  ${this.props.elem.source}  -> ${this.props.elem.destination}`}
                    {console.log(this.props.num, this.props.card.id)}
                    {this.props.card.id % 2 === 0 ?
                        info.map((carts, index) => {
                            return <>
                                <div>
                                    <label>
                                        sourceInfo ::
                                    </label>
                                    <div> rack : {carts.source.rack_id} ,
                                        shelf: {carts.source.shelf_id} ,slots: {JSON.stringify(carts.source.slot_id_list)}</div>
                                    <label>
                                        destInfo ::
                                    </label>
                                    <div>rack : {carts.destination.rack_id} ,
                                        shelf: {carts.destination.shelf_id} ,slots: {JSON.stringify(carts.destination.slot_id_list)}</div>
                                </div>

                            </>
                        })
                        : null}


                </div>
            </>
        }
    };

    onClicked = (ev, id) => {
        //console.log('Clickedd', ev.target, id)
        ev.preventDefault();
        if (typeof this.props.setPrevClick === "function") {
            this.props.setPrevClick(true);
            this.props.onPortClick(id);
        }
    };

    calcDims(ports, width, height) {
        const newPorts = _.cloneDeep(ports);
        newPorts.forEach(port => {
            port.width *= width;
            port.height *= height;
            port.pos.width *= width;
            port.pos.height *= height;
        });
        return newPorts;
    };

    onMouseOverPortToolTip = (e, portID, num) => {
        // //console.log('onMouseOverPortToolTip', document.getElementById('tooltipD' + portID))
        document.getElementById(num + 'tooltipD' + portID).classList.remove("tooltipHidden");
        document.getElementById(num + 'tooltipD' + portID).classList.add("tooltipVisible")

    };

    onMouseOutPort = (e, portID, num) => {
        // //console.log('onMouseOutPort', document.getElementById('tooltipD' + portID));
        document.getElementById(num + 'tooltipD' + portID).classList.remove("tooltipVisible");
        document.getElementById(num + 'tooltipD' + portID).classList.add("tooltipHidden");
    };

    onMouseOverCartToolTip = (e, num) => {
        // //console.log('onMouseOverPortToolTip', document.getElementById('tooltipD' + portID))
        document.getElementById(num + 'tooltipCartD').classList.remove("tooltipHidden");
        document.getElementById(num + 'tooltipCartD').classList.add("tooltipVisible")

    };

    onMouseOutCart = (e, num) => {
        // //console.log('onMouseOutPort', document.getElementById('tooltipD' + portID));
        document.getElementById(num + 'tooltipCartD').classList.remove("tooltipVisible");
        document.getElementById(num + 'tooltipCartD').classList.add("tooltipHidden");
    };

    //hamidi
    getGroomout_capcity(demandId, groomoutId) {
        let demands = this.props.traffic.main.low_rate_grooming_result.demands;
        let demand_groomouts = demands[demandId].groomouts;
        let selectedDemand;
        let groomout_id;
        let groomout_capacity;
        let groomout_lightpath_id;
        let groomout_service_id_list;
        let groomout_service_id_list_id;
        let groomout_service_id_list_type;
        for (let i in demand_groomouts) {
            selectedDemand = demand_groomouts[groomoutId];
            groomout_id = selectedDemand.id;
            groomout_capacity = selectedDemand.capacity;
            groomout_lightpath_id = selectedDemand.lightpath_id;
            groomout_service_id_list = selectedDemand.service_id_list;
            //console.log(`"demandXY: groomout_id: ${groomout_id},groomout_capacity:  ${groomout_capacity}, groomout_lightpath_id: ${groomout_lightpath_id}`);
            for (let i in groomout_service_id_list) {
                groomout_service_id_list_id = groomout_service_id_list[i].id;
                groomout_service_id_list_type = groomout_service_id_list[i].type;
                //console.log(`"demandX:", groomout_service_id_list_id: ${groomout_service_id_list_id}, groomout_service_id_list_type:${groomout_service_id_list_type}`);
            }

        }
        return groomout_capacity;
    }

    render() {
        return (

            this.makeTable()
        );
    }

}

export default Card;