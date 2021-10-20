import React from 'react';
import './LeftTemp.css';
import img1 from './../../cards/img/socket.jpg'
import config from './../../../config';
import DragAndDrop from "./../Modules/DragAndDrop";
import AdbIcon from "../components/card";


class LeftTemp extends React.Component {

    state = {networkPanels: null, currentServiceSelected: null, currentGroomoutSelected: null};

    onClickImage = (e) => {
        // //console.log('cart selected ', e.target.id);
        // this.setState({networkPanels: e.target.id});
        // if (this.props.selectedNetworkPanelsFromDetail) {
        //     this.props.selectedNetworkPanelsFromDetail(e.target.id);
        // }
    };

    onMouseDownServices = (e) => {
        //console.log('service selected ', e.target.id, e.target.name);
        this.setState({currentServiceSelected: e.target.id});
        if (this.props.selectedCurrentServiceFromDetail) {
            this.props.selectedCurrentServiceFromDetail(e.target.id);
        }
    };

    onMouseDownGroomouts = (e) => {
        //console.log('groomout selected ', e.target.id, e.target.name);
        this.setState({currentGroomoutSelected: e.target.id});
        if (this.props.selectedCurrentGroomoutFromDetail) {
            this.props.selectedCurrentGroomoutFromDetail(e.target.id);
        }
    };

    drag(ev, id) {
        //console.log('drag', id);
        this.setState({currentServiceSelected: id});
        this.props.selectedCurrentServiceFromDetail(id)
        // ev.dataTransfer.setData("id", id);
    }

    dragGroom(ev, id) {
        //console.log('dragGroom', id);
        this.setState({currentGroomoutSelected: id});
        this.props.selectedCurrentGroomoutFromDetail(id)
        // ev.dataTransfer.setData("id", id);
    }

    onClickSendLightPathes = (lightPathes) => {
        //console.log(lightPathes);
        window.open(`http://192.168.7.22?lightPath=${lightPathes}`);
    };

    onMouseOverCartToolTip = (e, num) => {
        // //console.log('onMouseOverPortToolTip', document.getElementById('tooltipD' + portID))
        document.getElementById(num + 'tooltipLightPath').classList.remove("tooltipHidden");
        document.getElementById(num + 'tooltipLightPath').classList.add("tooltipVisible")

    };

    onMouseOutCart = (e, num) => {
        // //console.log('onMouseOutPort', document.getElementById('tooltipD' + portID));
        document.getElementById(num + 'tooltipLightPath').classList.remove("tooltipVisible");
        document.getElementById(num + 'tooltipLightPath').classList.add("tooltipHidden");
    };

    onMouseOverGroomToolTip = (e, num) => {
        // //console.log('onMouseOverPortToolTip', document.getElementById('tooltipD' + portID))
        document.getElementById(num + 'tooltipGroom').classList.remove("tooltipHidden");
        document.getElementById(num + 'tooltipGroom').classList.add("tooltipVisible")

    };

    onMouseOutGroom = (e, num) => {
        // //console.log('onMouseOutPort', document.getElementById('tooltipD' + portID));
        document.getElementById(num + 'tooltipGroom').classList.remove("tooltipVisible");
        document.getElementById(num + 'tooltipGroom').classList.add("tooltipHidden");
    };

    render() {
        let options = [{id: config.carts.MP2X.id, name: config.carts.MP2X.name}, {
            id: config.carts.MP2D.id,
            name: config.carts.MP2D.name
        }, {id: config.carts.MP1H.id, name: config.carts.MP1H.name}];
        let lightPathes = this.props.lightPathes;
        let services = this.props.services;
        let groomouts = this.props.groomouts;
        return <div className={'bodyOfLeftTemp'}>

            <div>
                <div className="rightTempItem">
                    <label className="labels"> Panels </label>
                </div>
                <div className="optionsLOV1">

                    {options.map((row, index) => {
                            return <div style={{margin: '5px'}} key={`option${index}`}>

                                <div style={{
                                    float: 'left',
                                    fontFamily: 'initial'
                                }}>
                                    <option
                                        key={'option' + index}
                                        onClick={(e) => {
                                        }}
                                        value={((options)[index])['id']}>

                                        {`${index + 1} - ` + ((options)[index])['name']}
                                    </option>
                                </div>
                                <div>
                                    <img id={row.id} onMouseDown={this.onClickImage} src={img1} alt="cards"
                                         width="20"
                                         height="20"/>
                                </div>

                            </div>
                        }
                    )}

                </div>
                <div  className="rightTempItem">
                    <label className="labels"> LightPathes </label>
                </div>
                <div className="optionsLOV2">

                    {lightPathes.length > 0 ?
                        lightPathes.map((row, index) => {
                            // console.log("lightPathes.map",row,index);
                            return <div style={{margin: '5px', width: '100%'}} key={`lightPathes${index}`}>

                                <div

                                    onMouseOver={(e) => {
                                        this.onMouseOverCartToolTip(e, index)
                                    }}
                                    onMouseOut={(e) => {
                                        this.onMouseOutCart(e, index)
                                    }}
                                    style={{
                                        paddingTop: '2px',
                                        width: '100%',
                                        float: 'left',
                                        fontFamily: 'initial'
                                    }}>
                                    <option
                                        key={'lightPathes' + index}
                                        onClick={(e) => {
                                        }}
                                        value={((lightPathes)[index])['id']}>

                                        {`${index + 1} - ` + ((lightPathes)[index])['name']}
                                    </option>
                                    {
                                        row.lightPath ? <button onClick={() => {
                                            this.onClickSendLightPathes(row.lightPath ? row.lightPath : "")
                                        }}>send lightPath
                                        </button> : null
                                    }
                                </div>

                                <div className={`mp2xP--button tooltipHidden`}
                                     key={index + 'tooltipLightPath'}
                                     id={index + 'tooltipLightPath'}
                                     style={{

                                         display: "unset",
                                         // whiteSpace: "break-spaces",
                                         backgroundColor: "black",
                                         color: "#fff", marginTop: '-25px', borderRadius: "4px", padding: "5px",
                                         zIndex: '100',
                                         transform: "translate(" + 0 + "px, " + 40 + "px)"
                                     }}
                                >
                                    {JSON.stringify('capacity is : ' + row.capacity + ' ,')}
                                    {JSON.stringify(row.card_address)}

                                </div>


                            </div>
                        }) : null
                    }

                </div>

                <div  className="rightTempItem">
                    <label className="labels"> Services </label>
                </div>
                <div className="optionsLOV3">
                    {services.length > 0 ?
                        services.map((row, index) => {
                            // //console.log(services[index].services.service_id_list.length);
                            return <div style={{margin: '5px'}} key={`services${index}`}>

                                <div style={{
                                    float: 'left',
                                    fontFamily: 'initial'
                                }}>
                                    <option disabled={services[index].services.service_id_list.length === 0}
                                            key={'services' + index}
                                            onClick={(e) => {
                                            }}
                                            value={((services)[index])['id']}>

                                        {`${index + 1} - ` + ((services)[index])['name']}
                                    </option>
                                </div>
                                <div style={{paddingLeft: '100px'}}>
                                    <img id={row.id} name={((services)[index])['name']} src={img1} alt="services"
                                         onMouseDown={this.onMouseDownServices}
                                         onDragStart={(ev) => this.drag(ev, row.id)}
                                         width="20"
                                         disabled={true}
                                         height="20"/>
                                    <label
                                        style={{paddingLeft: '15px'}}>{services[index].services.service_id_list.length}</label>
                                </div>

                            </div>
                        }) : null
                    }

                </div>


                <div  className="rightTempItem">
                    <label className="labels"> Groomouts </label>
                </div>
                <div className="optionsLOV3">
                    {groomouts.length > 0 ?
                        groomouts.map((row, index) => {
                            // //console.log(services[index].services.service_id_list.length);
                            //console.log("Rowwww",row);
                            return <div style={{margin: '5px'}} key={`groomouts${index}`}>

                                <div
                                    onMouseOver={(e) => {
                                        this.onMouseOverGroomToolTip(e, index)
                                    }}
                                    onMouseOut={(e) => {
                                        this.onMouseOutGroom(e, index)
                                    }}
                                    style={{
                                        float: 'left',
                                        fontFamily: 'initial'
                                    }}>
                                    <option disabled={groomouts.length === 0}
                                            key={'groomouts' + index}
                                            onClick={(e) => {
                                            }}
                                            value={((groomouts)[index])['id']}>

                                        {`${index + 1} - ` + ((groomouts)[index])['name']}
                                    </option>
                                </div>
                                <div style={{paddingLeft: '100px'}}>
                                    <img id={row.id} name={((groomouts)[index])['name']} src={img1} alt="groomouts"
                                         onMouseDown={this.onMouseDownGroomouts}
                                         onDragStart={(ev) => this.dragGroom(ev, row.id)}
                                         width="20"
                                         disabled={true}
                                         height="20"/>
                                    {/* <label
                                        style={{ paddingLeft: '15px' }}>{groomouts.length}</label> */}
                                </div>

                                <div className={`mp2xP--button tooltipHidden`}
                                     key={index + 'tooltipGroom'}
                                     id={index + 'tooltipGroom'}
                                     style={{
                                         display: "unset",
                                         // whiteSpace: "break-spaces",
                                         backgroundColor: "black",
                                         color: "#fff", marginTop: '-25px', borderRadius: "4px", padding: "5px",
                                         zIndex: '100',
                                         transform: "translate(" + 0 + "px, " + 40 + "px)"
                                     }}
                                >
                                    {JSON.stringify(row)}

                                </div>

                            </div>
                        }) : null
                    }

                </div>
            </div>

        </div>;
    }
}

export default LeftTemp;