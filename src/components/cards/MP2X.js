import React from 'react';
import socket from './img/socket.jpg'
import complete from './img/circle/complete.jpg'
import {FaTrashAlt} from "react-icons/fa"
import './MP2X.css'
import config from "../../config";
import greenCircle from "./img/circle/greenCircle.png";
import warningCircle from "./img/circle/warningCircle.png";
import simpleCircle from "./img/circle/simpleCircle.png";
import simpleSocket from "./img/socket/simpleSocket.png";
import linesSocketRed from "./img/socket/linesSocketRed.png";
import lineSocket from "./img/socket/lineSocket.png";

class MP2X extends React.Component {
    render() {
        const cartName = 'MP2X'
        let loop = [];
        for (let z = 0; z < 9; z++) {
            loop.push(z);
        }
        let key = this.props.index;

        return <div style={{margin: '3px', height: '490px', width: '10%', backgroundColor: '#F2F8FD', float: 'left'}}
                    key={`bodyMP2X${key}`}>

            {/* {console.log("Mp2xPannel",this.props.selectedShelves, key, config.carts.MP2X.id)} */}
            {/*<div className={'rightMP2X'} key={`rightMP2X${key}`}*/}
            {/*style={{height: '450px', width: '5%', backgroundColor: '#F2F8FD', float: 'left'}}>*/}

            {/*{loop.map((row, i) => {*/}
            {/*return <div key={`socketsDiv${i}`}>*/}
            {/*<img key={`socket${i}`} src={socket} height={'30px'} alt={'socket'}*/}
            {/*style={{paddingLeft: '5px', paddingTop: '15px'}}/>*/}
            {/*<img key={`socket${i + 1}`} src={socket} height={'30px'} alt={'socket'}*/}
            {/*style={{paddingLeft: '5px', paddingTop: '15px'}}/>*/}
            {/*</div>*/}
            {/*})}*/}
            {/*</div>*/}
            {/*<div className={'leftMP2X'} key={`leftMP2X${key}`}*/}
            {/*style={{height: '450px', width: '5%', backgroundColor: '#F2F8FD', float: 'left'}}>*/}
            {/*<FaTrashAlt key={key} onClick={() => {*/}
            {/*this.props.deletemp2x(this.props.selectedShelves, key, config.carts.MP2X.id)*/}
            {/*}} style={{color: 'maroon'}} className={'menuOfCarts'}/>*/}
            {/*<img src={complete} height={'450px'} alt={'socket'}/>*/}
            {/*MP2X*/}
            {/*</div>*/}


            {/*====================header========================*/}
            <div key={`header${cartName}${key}`} className={`header${cartName}`}>
                {cartName}
                <FaTrashAlt key={key} onClick={() => {
                    this.props.deletemp2x(this.props.selectedShelves, key, config.carts.MP2X.id)
                }} style={{color: 'maroon'}} className={'menuOfCarts'}/>
            </div>
            {/*====================actions========================*/}
            <div key={`actions${cartName}${key}`}>
                <img src={greenCircle} height={'15px'} alt={'socket'}/>
                <img src={warningCircle} height={'15px'} alt={'socket'}/>
                <img src={simpleCircle} height={'15px'} alt={'socket'}/>
            </div>
            {/*====================inputs========================*/}
            <div key={`input${cartName}${key}`}>
                <div>
                    {loop.map((row, i) => {
                        return <div style={{paddingTop: '0px'}} key={`socketsDiv${i}`}>
                            <div style={{float: 'left'}}>
                                <img src={simpleSocket} height={'30px'} alt={'socket'}
                                     style={{paddingLeft: '5px', paddingTop: '10px'}}/>
                                <img src={simpleSocket} height={'30px'} alt={'socket'}
                                     style={{paddingLeft: '5px', paddingTop: '10px'}}/>
                            </div>
                            <div style={{paddingTop: '2px'}}>
                                <div>
                                    <img src={simpleCircle} height={'10px'} alt={'simpleCircle'}
                                         style={{paddingLeft: '2px'}}/>
                                    <img src={simpleCircle} height={'10px'} alt={'simpleCircle'}
                                         style={{paddingLeft: '2px'}}/>
                                </div>
                                <div>
                                    <img src={simpleCircle} height={'10px'} alt={'simpleCircle'}
                                         style={{paddingLeft: '2px'}}/>
                                    <img src={simpleCircle} height={'10px'} alt={'simpleCircle'}
                                         style={{paddingLeft: '2px'}}/>
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
            <div style={{paddingLeft: '7px', paddingTop: '10px'}}>


                <div style={{float: 'left'}}>
                    <img src={lineSocket} height={'15px'} alt={'socket'}/>
                </div>
                <div>
                    <img src={lineSocket} height={'15px'} alt={'socket'}/>
                </div>


            </div>
        </div>

    }
}

export default MP2X;
