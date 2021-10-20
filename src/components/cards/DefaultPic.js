import React from 'react';
import DefaultPic1 from './img/slot.jpg'
import './DefaultPic.css'
import {FaRegObjectUngroup} from "react-icons/fa"

class DefaultPic extends React.Component {
    state = {
        selectedNetworkPanels: this.props.selectedNetworkPanels
    };
    allowDrop = (ev) => {
        // //console.log('allowDrop', this.props.selectedNetworkPanels, ev.target.id);
        ev.preventDefault();
    };
    drop = (ev) => {
        //console.log('drop', this.props.selectedNetworkPanels, ev.target.id);
        ev.preventDefault();

        this.add(this.props.selectedShelves, ev.target.id, this.props.selectedNetworkPanels);
    };
    add = (selectedShelves, place, cart) => {

        //اگه شلوی نباشد و انتخاب نشده باشد اجازه کم و زیاد کردن کارت ندارد
        if (this.props.shelves.length !== 0 && this.props.selectedShelves > 0) {
            this.props.addmp2x(selectedShelves, place, cart);
        } else {
            alert('لطفا یک shelves ایجاد کنید و سپس کارت اضافه کنید ')
        }
    };

    render() {
        //console.log('default');
        let key = this.props.index;


        return <div className={'bodyOfCarts'} style={{float: 'left'}} key={`bodyDefaultPic${key}`}>
            <div id={'menu' + key}
                 className={'menuOfImg'}
                 onDrop={(e) => this.drop(e)} onDragOver={(e) => this.allowDrop(e)}
                 onMouseOver={(e) => {
                     this.allowDrop(e);
                 }}>
                محل کارت<FaRegObjectUngroup/>
            </div>
            <img className={'defaultPic'}
                 key={`DefaultPic1${key}`} src={DefaultPic1} width={'120px'}
                 height={'470px'} alt={'socket'}
            />
        </div>


    }
}

export default DefaultPic;
