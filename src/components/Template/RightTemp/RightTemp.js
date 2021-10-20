import React from 'react';
import './RightTemp.css'
import App from "../App";

class RightTemp extends React.Component {
    constructor(props) {
        super(props);
        this.child_app = React.createRef();
    }

    // mixCurrentShelfWithServices = (currentShelf, lightPath_of_currentShelfWithService) => {
    //     console.log('currentShelf & lightPath_of_currentShelfWithService', currentShelf, lightPath_of_currentShelfWithService);
    //     let currentShelfWithServices = currentShelf;
    //     if (Array.isArray(currentShelf.children) && Array.isArray(lightPath_of_currentShelfWithService)) {
    //         if (currentShelf.children.length > 0 && lightPath_of_currentShelfWithService.length > 0) {
    //
    //             for (let j = 0; j < lightPath_of_currentShelfWithService.length; j++) {
    //                 for (let i = 0; i < currentShelf.children.length; i++) {
    //                     if (currentShelf.children[i].lightpath_id === lightPath_of_currentShelfWithService[j].lightpathId) {
    //                         // console.log('***********', lightPath_of_currentShelfWithService[j].lightpathId);
    //                         currentShelfWithServices.children[i]['services'] = lightPath_of_currentShelfWithService[j].services;
    //                     }
    //                 }
    //             }
    //         }
    //
    //     }
    //     return currentShelfWithServices;
    // };
    // makeImage = (currentShelfWithServices, cartType, key) => {
    //     let objImage = {};
    //     // let images = [];
    //     // console.log('componentDidMount', currentShelfWithServices);
    //     if (currentShelfWithServices) {
    //         // console.log('0000', currentShelfWithServices.children, key);
    //         for (let i = 0; i < currentShelfWithServices.children.length; i++) {
    //             // console.log('00', currentShelfWithServices.children[i].place, key);
    //             //به ازای هر کارت
    //             if (currentShelfWithServices.children[i].place === key) {
    //                 if (currentShelfWithServices.children[i].services) {
    //                     console.log('cart number', key, 'count of services: ', currentShelfWithServices.children[i].services);
    //                     //به ازای سرویس های هر کارت
    //                     for (let j = 0; j < currentShelfWithServices.children[i].services.length; j++) {
    //                         if (currentShelfWithServices.children[i].services[j].type === 'normal') {
    //                             objImage[`socket${cartType}${j * 2}`] = greenSocket;
    //                             objImage[`socket${cartType}${(j * 2) + 1}`] = greenSocket;
    //                             // images.push(`socket${cartType}${j * 2}`);
    //                             // images.push(`socket${cartType}${(j * 2) + 1}`);
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     // images.push(objImage);
    //     return objImage;
    // };
    setMapping = (source, rack, shelf, fromMaster, mapping) => {
        this.child_app.current.handleChange(source, rack, shelf, fromMaster, mapping);
    };

    render() {
        // console.log('mapping', this.props.mapping);
        // let selectedShelves = this.props.selectedShelves;
        // let shelves = this.props.shelves;
        // let currentShelves = selectedShelvesFunc(shelves, selectedShelves);
        // let carts = currentShelves['carts'];
        // let currentShelfWithServices = this.mixCurrentShelfWithServices(currentShelves, this.props.lightPath_of_currentShelfWithService);
        // console.log('currentShelfWithServices is :', currentShelfWithServices, 'services of demands is : ', this.props.services);
        return <div className={'bodyOfRightTemp'}>

            <App basicRefresh={this.props.basicRefresh}
                 basicFillServiceDevice={this.props.basicFillServiceDevice}
                 services={this.props.services}
                 groomouts={this.props.groomouts}
                 addServices_of_demands={this.props.addServices_of_demands}
                 deleteServices_of_demands={this.props.deleteServices_of_demands}
                 deleteGroomout_of_demands={this.props.deleteGroomout_of_demands}
                 ref={this.child_app} selectedCurrentService={this.props.selectedCurrentService}
                 setMappingCart={this.props.setMappingCart} mapping={this.props.mapping}
                 selectedSourceText={this.props.selectedSourceText}
                 selectedDestinationText={this.props.selectedDestinationText}
                 selectedSource={this.props.selectedSource}
                 selectedRacks={this.props.selectedRacks}
                 service_devices={this.props.service_devices}
                 node_structure={this.props.node_structure}
                 currentShelves={this.props.currentShelves}
                 selectedShelves={this.props.selectedShelves}
                 traffic={this.props.traffic}
                 basicFillServices={this.props.basicFillServices}
                 serviceOrGroom={this.props.serviceOrGroom}
                 demands={this.props.demands}
                 demand_id={this.props.demand_id}
                 basicFillGrooming={this.props.basicFillGrooming}
                 basicFillLightPath={this.props.basicFillLightPath}
                 lightPathes={this.props.lightPathes}
                 lightpath_cap = {this.props.lightpath_cap}
                 groomouts_cap = {this.props.groomouts_cap}   
            />
            {/*{*/}
            {/*    currentShelfWithServices['carts'] ?*/}
            {/*        currentShelfWithServices['carts'].map((row, key) => {*/}
            {/*            let images = this.makeImage(currentShelfWithServices, row, key);*/}
            {/*            if (row === 'MP1H') {*/}
            {/*                return <MP1H images={images}*/}
            {/*                             selectedCurrentService={this.props.selectedCurrentService}*/}
            {/*                             currentShelfWithServices={currentShelfWithServices}*/}
            {/*                             lightPath_of_currentShelfWithService={this.props.lightPath_of_currentShelfWithService}*/}
            {/*                             selectedNetworkPanels={this.props.selectedNetworkPanels}*/}
            {/*                             deletemp2x={this.props.deletemp2x} shelves={shelves} index={key}*/}
            {/*                             selectedShelves={selectedShelves}*/}
            {/*                    // count={shelves.length !== 0 && selectedShelves ? count_of_mp1h : 0}*/}
            {/*                             key={`mp1h${key}`}*/}
            {/*                             addServices_of_demands={this.props.addServices_of_demands}*/}
            {/*                             deleteServices_of_demands={this.props.deleteServices_of_demands}*/}
            {/*                />*/}
            {/*            } else if (row === 'MP2X') {*/}
            {/*                return <MP2X selectedNetworkPanels={this.props.selectedNetworkPanels}*/}
            {/*                             deletemp2x={this.props.deletemp2x} index={key} carts={carts} shelves={shelves}*/}
            {/*                             selectedShelves={selectedShelves}*/}
            {/*                    // count={shelves.length !== 0 && selectedShelves ? count_of_mp2x : 0}*/}
            {/*                             key={`mp2x${key}`}/>*/}
            {/*            } else if (row === 'MP2D') {*/}
            {/*                return <MP2D selectedNetworkPanels={this.props.selectedNetworkPanels}*/}
            {/*                             deletemp2x={this.props.deletemp2x} index={key}*/}
            {/*                             selectedShelves={selectedShelves}*/}
            {/*                             key={`mp2d${key}`}/>*/}
            {/*            } else if (row === 'default') {*/}
            {/*                return <DefaultPic index={key} addmp2x={this.props.addmp2x} shelves={shelves}*/}
            {/*                                   selectedShelves={selectedShelves}*/}
            {/*                                   selectedNetworkPanels={this.props.selectedNetworkPanels}*/}
            {/*                    // count={shelves.length !== 0 && selectedShelves ? count_of_defaultPic : 0}*/}
            {/*                                   key={`defaultPic${key}`}/>*/}
            {/*            }*/}
            {/*        }) : null*/}
            {/*}*/}
        </div>
            ;
    }
}

export default RightTemp;