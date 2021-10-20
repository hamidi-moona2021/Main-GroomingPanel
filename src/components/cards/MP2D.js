import React from 'react';
import socket from './img/socket.jpg'
import complete from './img/circle/complete.jpg'
import greenCircle from './img/circle/greenCircle.png'
import simpleCircle from './img/circle/simpleCircle.png'
import warningCircle from './img/circle/warningCircle.png'
import greenSocket from './img/socket/greenSocket.png'
import simpleSocket from './img/socket/simpleSocket.png'
import warningSocket from './img/socket/warningSocket.png'
import linesSocketRed from './img/socket/linesSocketRed.png'
import lineSocket from './img/socket/lineSocket.png'

import {FaTrashAlt} from "react-icons/fa"
import './MP2D.css'
import config from "../../config";

class MP2D extends React.Component {

    state = {};

    onMouseOver = (ev) => {
        //console.log('onMouseOver', this.props.selectedNetworkPanels, ev.target.id);
        ev.preventDefault();
    };
    allowDrop = (ev) => {
        //console.log('allowDrop', this.props.selectedNetworkPanels, ev.target.id);
        ev.preventDefault();
    };
    drop = (ev, socketName) => {
        //console.log('dropping', socketName, this.props.selectedNetworkPanels, ev.target.id);
        this.setState({[socketName]: greenSocket});
        ev.preventDefault();


    };

    render() {
        const cartName = 'MP2D';
        let loop = [];
        let loopCircle = [];
        for (let z = 0; z < 2; z++) {
            loop.push(z);
        }
        for (let z = 0; z < 5; z++) {
            loopCircle.push(z);
            // this.state[`socket${cartName}${(z * 2)}`] = simpleSocket;
            // this.state[`socket${cartName}${(z * 2) + 1}`] = simpleSocket;
        }
        let key = this.props.index;
        // //console.log('MP1H', this.state);
        return <div key={`bodyMP2D${key}`}
                    style={{margin: '3px', height: '490px', width: '10%', backgroundColor: '#F2F8FD', float: 'left'}}>

            {/*====================header========================*/}
            <div key={`header${cartName}${key}`} className={`header${cartName}`}>
                {cartName}
                <FaTrashAlt key={key} onClick={() => {
                    this.props.deletemp2x(this.props.selectedShelves, key, config.carts.MP2D.id)
                }} style={{color: 'maroon'}} className={'menuOfCarts'}/>
            </div>
            {/*====================actions========================*/}
            <div key={`actions${cartName}${key}`}>
                <img src={greenCircle} height={'15px'} alt={'socket'}/>
                <img src={warningCircle} height={'15px'} alt={'socket'}/>
                <img src={simpleCircle} height={'15px'} alt={'socket'}/>
            </div>
            {/*====================inputs========================*/}
            <div className={'inputBody'} key={`input${cartName}${key}`}>
                <div>
                    {loop.map((row, i) => {
                        return <div style={{paddingTop: '15px'}} key={`socketsDiv${i}`}>
                            <div className={'socketsBody'} style={{float: 'left'}}>
                                <img onDrop={(e) => this.drop(e, `socket${cartName}${(i * 2)}`)}
                                     onDragOver={(e) => this.allowDrop(e)}
                                     onMouseOver={(e) => {
                                         this.onMouseOver(e);
                                     }}
                                     src={this.state[`socket${cartName}${i * 2}`] ? this.state[`socket${cartName}${i * 2}`] : simpleSocket}
                                     height={'30px'} alt={'socket'}
                                     style={{paddingLeft: '5px', paddingTop: '10px'}}/>
                                {/*<img onDrop={(e) => this.drop(e, `socket${cartName}${(i * 2) + 1}`)}*/}
                                     {/*onDragOver={(e) => this.allowDrop(e, `socket${cartName}${i * 2}`)}*/}
                                     {/*onMouseOver={(e) => {*/}
                                         {/*this.onMouseOver(e);*/}
                                     {/*}}*/}
                                     {/*src={this.state[`socket${cartName}${(i * 2) + 1}`] ? this.state[`socket${cartName}${(i * 2) + 1}`] : simpleSocket}*/}
                                     {/*height={'30px'} alt={'socket'}*/}
                                     {/*style={{paddingLeft: '5px', paddingTop: '10px'}}/>*/}
                            </div>
                            <div style={{paddingTop: '2px'}}>
                                <div>
                                    <img src={simpleCircle} height={'10px'} alt={'simpleCircle'}
                                         style={{paddingLeft: '2px'}}/>
                                    {/*<img src={simpleCircle} height={'10px'} alt={'simpleCircle'}*/}
                                         {/*style={{paddingLeft: '2px'}}/>*/}
                                </div>
                                <div>
                                    <img src={simpleCircle} height={'10px'} alt={'simpleCircle'}
                                         style={{paddingLeft: '2px'}}/>
                                    {/*<img src={simpleCircle} height={'10px'} alt={'simpleCircle'}*/}
                                         {/*style={{paddingLeft: '2px'}}/>*/}
                                </div>
                            </div>
                        </div>
                    })}
                </div>
                {/*<div>*/}
                {/*{loopCircle.map((row, i) => {*/}
                {/*return <div key={`circleDiv${i}`}>*/}
                {/**/}
                {/*</div>*/}
                {/*})}*/}
                {/*</div>*/}
            </div>
            {/*====================outputs========================*/}
            <div style={{paddingLeft: '7px', paddingTop: '92px'}}>
                <div style={{float: 'left'}} key={`output${cartName}${key}`}>
                    <img src={linesSocketRed} height={'75px'} alt={'socket'}/>

                </div>
                <div>
                    <div>
                        <img src={lineSocket} height={'15px'} alt={'socket'}/>
                    </div>
                    <div>
                        <div>
                            <img src={simpleCircle} height={'10px'} alt={'simpleCircle'}
                                 style={{paddingLeft: '2px'}}/>

                        </div>
                        <div>
                            <img src={simpleCircle} height={'10px'} alt={'simpleCircle'}
                                 style={{paddingLeft: '2px'}}/>

                        </div>
                    </div>
                </div>
            </div>


        </div>
    }
}

export default MP2D;
