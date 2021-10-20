import React from 'react';
import LeftTemp from './LeftTemp/LeftTemp'
import RightTemp from './RightTemp/RightTemp'
import Header from "./Header/Header";
import './Template.css'
import {
    removeFromYourArray,
    specialCarts,
    standardMapping,
    standardRacks,
    racks_of_serverFile,
    standardShelves,
    filter_useLightPath_from_allLightPath_in_source

} from "../../utils/util";
import { demands_mapping } from './../../utils/demandsUtil/demandsUtil'
import config, { node_structure } from './../../config'
import axios from "axios";
import { setState } from "expect/build/jestMatchersObject";
import Loading from "../Table2/loading/Loading";
import { addShelfInServiceDevice, createBasicShelf } from "../../utils/service_deviceUtil/service_deviceUtil";
import { node_structure_mapping, node_structure_mapping_final } from "../../utils/node_structureUtil/node_structureUtil";
import { capacity, traffic_mapping } from "../../utils/trafficUtil/trafficUtil";
import { remove } from 'lodash';

class Template extends React.Component {

    constructor(props) {
        super(props);
        this.child_rightTemp = React.createRef();
    }

    setMappingFromHeaderTemplate = (source, rack, shelf, fromMaster, mapping) => {
        this.child_rightTemp.current.setMapping(source, rack, shelf, fromMaster, mapping);
    };

    state = {
        flagRefresh: false,
        lock: true,
        demand_id: 0,
        // lock: {header: {createRack: true, createShelf: true}, left: {}, right: {}},
        limit: 7,
        racks: [],
        shelves: [],
        lightPathes: [],
        services: [],
        groomouts: [],
        serviceOrGroom: '',
        currentShelves: {},
        selectedRacks: null,
        selectedShelves: null,
        selectedNetworkPanels: 1,
        selectedCurrentService: 1,
        selectedCurrentGroomout: 1,
        source: [],
        lightPath_of_currentShelfWithService: [],
        mapping: [],
        demands: {},
        service_devices: {},
        node_structure: {},
        traffic: {},
        loading: false,
        selectedSource: '',
        selectedSourceText: '',
        selectedDestination: '',
        selectedDestinationText: '',
        groomouts_cap: [],
        lightpath_cap: 0,
        low_rate_grooming_result:[],
    };

    setMappingCart = (setMappingFunc) => {
    };

    callServicesFromServer = async (city, version, grooming_id) => {
        try {
            let finalObjectFromServer = {};
            const apiURL = config.ipAddress.sinaLocalNetwork;
            //////////////////////////////////////////////////////////
            ////////////////////      token       \\\\\\\\\\\\\\\\\\\\
            const token_body = new URLSearchParams();
            token_body.append('username', 'amir');
            token_body.append('password', '1234');
            const token_config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            const token_result = await axios.post(`${apiURL}/v2.0.0/users/login`, token_body, token_config);
            const access_token = token_result.data.access_token;
            const token_type = token_result.data.token_type;
            //////////////////////////////////////////////////////////
            //////////////////// traffic matrices \\\\\\\\\\\\\\\\\\\\
            const traffic_config = {
                headers: { "Authorization": `${token_type} ${access_token}` }
            };
            //kerman,1
            const traffic_result = await axios.get(`${apiURL}/v2.0.0/traffic_matrices?id=${city}&version=${version}`, traffic_config);
            //console.log("traffic_result:", traffic_result);
            // const traffic_result = await (`${apiURL}/v2.0.0/traffic_matrices?id=kerman&version=1`, traffic_config);

            //////////////////////////////////////////////////////////
            //////////////////// grooming \\\\\\\\\\\\\\\\\\\\
            const grooming_config = {
                headers: { "Authorization": `${token_type} ${access_token}` }
            };
            //0d929aa6-77fe-41cd-b9d2-551f245d5903
            const grooming_result = await axios.get(`${apiURL}/v2.0.0/algorithms/grooming/result?grooming_id=${grooming_id}`, grooming_config);
            //console.log("grooming_result:", grooming_result);
            // const grooming_result = await axios.get(`${apiURL}/v2.0.0/algorithms/grooming/result?grooming_id=6511e314-bbc4-4b11-8cbd-24710a16fc1f`, grooming_config);

            finalObjectFromServer.demands = traffic_result.data[0].data.demands;
            //console.log("<finalObjectFromServer.demands>", finalObjectFromServer.demands);

            finalObjectFromServer.service_devices = grooming_result.data.service_devices;
            //console.log("<finalObjectFromServer.service_devices>", finalObjectFromServer.service_devices);

            finalObjectFromServer.node_structure = grooming_result.data.node_structure;
            //console.log("<finalObjectFromServer.node_structure>", finalObjectFromServer.node_structure);

            finalObjectFromServer.traffic = grooming_result.data.traffic;
            //console.log("<finalObjectFromServer.traffic>", finalObjectFromServer.traffic);
            return finalObjectFromServer

        } catch (err) {
        }
    };

    async componentDidMount() {
        //================== get param from url ==============
        //{kerman, 1,6511e314-bbc4-4b11-8cbd-24710a16fc1f}
        // //console.log(this.props.match);
        let city = '';
        let version = '';
        let grooming_id = '';

        if (this.props.match) {
            const { grooming } = this.props.match.params;
            //console.log(grooming.split('&'));
            let groomingArray = grooming.split('&');
            city = groomingArray[0];
            version = groomingArray[1];
            grooming_id = groomingArray[2];
        }

        //================= get jsons from sever =============
        let demands = null;
        let service_devices = null;
        let node_structure = null;
        let traffic = null;
        let low_rate_grooming_result = null;
        if (config.server) {
            this.setState({ loading: true });
            let serverObj = await this.callServicesFromServer(city, version, grooming_id);

            if (serverObj) {
                demands = demands_mapping(serverObj.demands);
                service_devices = serverObj.service_devices;
                traffic = serverObj.traffic;
                low_rate_grooming_result = traffic.main.low_rate_grooming_result.demands;
                node_structure = node_structure_mapping(serverObj.node_structure, service_devices);
                //console.log('serverObj is : ', demands);
                //console.log('serverObj is : ', service_devices);
                //console.log('serverObj is : ', traffic);
                //console.log('serverObj is : ', node_structure);
            }
            this.setState({ loading: false });
        } else {
            demands = demands_mapping(config.demands);
            service_devices = config.service_devices;
            node_structure = node_structure_mapping(config.node_structure, config.service_devices);
            traffic = config.traffic;
            low_rate_grooming_result = traffic.main.low_rate_grooming_result.demands;
        }
        //**************************************************
        //************** ساختن لیستی از سورس ها ************
        let source = [];
        if (demands) {
            for (const item of Object.entries(demands)) {
                if (source.includes(item[1].source)) {

                } else {
                    source.push(item[1].source)
                }
            }
        }
        let newSource = [];
        for (let i = 0; i < source.length; i++) {
            let obj = {};
            obj['id'] = i + 1;
            obj['name'] = source[i];
            newSource.push(obj)
        }
        // //console.log('service_devices is : ', service_devices);
        this.setState({
            source: newSource,
            node_structure: node_structure,
            demands: demands,
            service_devices: service_devices,
            traffic: traffic,
            low_rate_grooming_result : low_rate_grooming_result
        });
        //====================================================
    }

    //Search groomingId in demands and return capacity
    getCapacityGrooming(demands,groomingId) {
        let selectedGroomOuts;
      
        for (let i in demands) {
            if(demands[i].groomouts[groomingId])
            {
                selectedGroomOuts = demands[i].groomouts[groomingId];
                let capacity_groom = selectedGroomOuts.capacity;
                //console.log("traffic_devices is :",selectedGroomOuts.capacity);
                return capacity_groom;
            }
          
        }
    }

    standardMapping = (mapping) => {
        this.setState({ mapping: mapping });
    };

    // calculate Capacity of 
    getGroomout_capcity(demandId, groomoutId) {
        let demands = this.state.traffic.main.low_rate_grooming_result.demands;
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

    basicFillGroomouts_cap = (groomouts_cap) => {
        this.setState({
            groomouts_cap: groomouts_cap
        })
    };

    basicFillLightPath_cap = (lightpath_cap) => {
        this.setState({
            lightpath_cap: lightpath_cap
        })
    };

    basicFillShelves = (shelves, lightPathes, racks, selectedSource, selectedSourceText, selectedRacks) => {
        //console.log('shelves in master : ', shelves, lightPathes, racks, selectedSource, selectedSourceText, selectedRacks);
        this.setState({
            shelves: shelves,
            selectedShelves: shelves[0] ? shelves[0].id : null,
            lightPathes: lightPathes,
            racks: racks,
            selectedSource: selectedSource,
            selectedSourceText: selectedSourceText,
            selectedRacks: selectedRacks
        })
        //console.log('shelves in master :after', this.state.shelves, this.state.lightPathes, this.state.racks, this.state.selectedSource, this.state.selectedSourceText, this.state.selectedRacks);
    };

    basicFillShelves2 = (shelves, lightPathes) => {
        this.setState({
            shelves: shelves,
            selectedShelves: shelves[0] ? shelves[0].id : null,
            lightPathes: lightPathes
        })
    };

    basicFillServices = (services) => {
        //console.log('basicFillServices', services);

        if (services) {
            this.setState({
                services: services,
            })
        }
    };

    basicFillGrooming = (groomouts) => {
        //console.log('basicFillGrooming', groomouts);
        if (groomouts) {
            this.setState({
                groomouts: groomouts,
            })
        }
    };

    basicRefresh = (flag) => {
        //  let mapping = standardMapping(this.state.selectedSourceText, standardRacks(this.state.racks).filter(rack => rack.id === parseInt(this.state.selectedRacks)),
        //         this.state.shelves.filter(shelf => shelf.id === this.state.selectedShelves), this.state.lightPath_of_currentShelfWithService);
        //         //console.log('555',mapping)
        //    this.setMappingFromHeaderTemplate(1, 1, 1, 1, mapping);
        // this.setState({
        //     flagRefresh: !this.state.flagRefresh,
        // })
        this.basicSetMapping()
    };

    basicSetMapping = () => {
        //console.log('**********************basicSetMapping********************')
        //console.log(this.state.selectedSourceText);
        let racks = racks_of_serverFile(this.state.selectedSourceText, this.state.node_structure);
        //console.log('racks are :', racks);
        let newRack;
        if (Object.keys(racks).length > 0) {
            newRack = standardRacks(racks);
            //console.log('standard rack : ', this.state.selectedSourceText, newRack)
        }
        //console.log('number of selected rack : ', this.state.selectedRacks);
        //console.log('choose rack : ', racks[this.state.selectedRacks - 1]);
        let chooseRack = racks[this.state.selectedRacks - 1];
        let shelves = chooseRack['shelves'];
        //console.log('shelves are : ', shelves);
        let newShelve = standardShelves(shelves);
        let useLightPath_shelves = filter_useLightPath_from_allLightPath_in_source(this.state.selectedSourceText, this.state.selectedRacks, this.state.selectedShelves, this.state.demands, this.state.traffic, this.state.service_devices, this.state.node_structure);
        //console.log('***', 'traffic', this.state.traffic, 'service_device', this.state.service_devices, 'node_structure', this.state.node_structure);
        let mapping = standardMapping(this.state.selectedSourceText, newRack, newShelve, useLightPath_shelves);
        //console.log('***********', mapping, this.state.selectedSourceText, newRack, newShelve, useLightPath_shelves);
        this.setMappingFromHeaderTemplate(1, 1, 1, 1, mapping);

    };

    basicFillLightPath = (lightPathes) => {
        this.setState({
            lightPathes: lightPathes,
        })
    };

    basicFillServiceDevice = (service_device) => {
        this.setState({
            service_device: service_device,
        })
    };

    basicFillDemand = (demand_id) => {
        this.setState({
            demand_id: demand_id,
        })
    };

    basicFillRack = (shelves, lightPathes) => {
        // //console.log('shelves in master : ', shelves);
        this.setState({
            shelves: shelves,
            selectedShelves: shelves[0] ? shelves[0].id : null,
            lightPathes: lightPathes,
        })
    };

    basicFillSelectedRacks = (selectedRacks) => {
        this.setState({
            selectedRacks: selectedRacks
        })
    };

    basicFillSelectedDestination = (selectedDestination, selectedDestinationText) => {
        this.setState({
            selectedDestination: selectedDestination,
            selectedDestinationText: selectedDestinationText
        })
    };

    basicFill_lightPath_of_currentShelfWithService = (lightPath_of_currentShelfWithService, currentShelves) => {
        // //console.log('lightPath_of_currentShelfWithService in master : ', lightPath_of_currentShelfWithService);
        this.setState({
            lightPath_of_currentShelfWithService: lightPath_of_currentShelfWithService,
            currentShelves: currentShelves

        })
    };

    addmp2x = (selectedShelves, place, cart) => {
        let shelves = this.state.shelves;
        let orgPlace = 0;
        switch (place) {
            case 'menu0':
                orgPlace = 0;
                break;
            case 'menu1':
                orgPlace = 1;
                break;
            case 'menu2':
                orgPlace = 2;
                break;
            case 'menu3':
                orgPlace = 3;
                break;
            case 'menu4':
                orgPlace = 4;
                break;
            case 'menu5':
                orgPlace = 5;
                break;
            case 'menu6':
                orgPlace = 6;
                break;

            default:
                orgPlace = 0
        }
        // شلوها با ایدی 1 شروع شده اند در ارایه پس در خانه 0 شلو 1 قرار دارد
        //selectedShelves همون ایدی هست
        //place جایگاه کارتها که از صفر شروع میشود
        if (shelves[selectedShelves - 1].children.length < this.state.limit || shelves[selectedShelves - 1].carts.includes('default')) {
            //اضافه کردن کارت انتخاب شده به شلو موردنظر
            for (let i = 0; i < this.state.shelves.length; i++) {
                //انتخاب کردن شلو مورد نظر
                if (shelves[i].id == selectedShelves) {
                    if (Array.isArray(shelves[i].children)) {
                        // //console.log('****', cart);
                        switch (cart) {

                            // 1 = MP2X
                            case "1":
                                shelves[i].children.push({
                                    type: 'MP2X',
                                    place: orgPlace
                                });
                                shelves[i].carts = specialCarts(shelves[i], 'MP2X');
                                break;
                            case "2":
                                shelves[i].children.push({
                                    type: 'MP2D',
                                    place: orgPlace
                                });
                                shelves[i].carts = specialCarts(shelves[i], 'MP2D');
                                break;
                            case '3':
                                shelves[i].children.push({
                                    type: 'MP1H',
                                    place: orgPlace
                                });
                                shelves[i].carts = specialCarts(shelves[i], 'MP1H');
                                break;
                            default:
                                orgPlace = 0
                        }
                    }
                }
            }
            this.setState({ shelves: shelves })
        } else {
            alert('دستگاه توانایی اضافه کردن بیش از 7 کارت را ندارد')
        }

    };

    deletemp2x = (selectedShelves, place, cart) => {
        // //console.log('deletemp2x : ', selectedShelves, place, cart)
        let shelves = this.state.shelves;
        let orgPlace = 0;
        switch (place) {
            case 'menu0':
                orgPlace = 0;
                break;
            case 'menu1':
                orgPlace = 1;
                break;
            case 'menu2':
                orgPlace = 2;
                break;
            case 'menu3':
                orgPlace = 3;
                break;
            case 'menu4':
                orgPlace = 4;
                break;
            case 'menu5':
                orgPlace = 5;
                break;
            case 'menu6':
                orgPlace = 6;
                break;

            default:
                orgPlace = 0
        }
        // شلوها با ایدی 1 شروع شده اند در ارایه پس در خانه 0 شلو 1 قرار دارد
        //selectedShelves همون ایدی هست
        //place جایگاه کارتها که از صفر شروع میشود
        //اضافه کردن کارت انتخاب شده به شلو موردنظر
        for (let i = 0; i < this.state.shelves.length; i++) {
            //انتخاب کردن شلو مورد نظر
            if (shelves[i].id == selectedShelves) {
                if (Array.isArray(shelves[i].children)) {
                    // //console.log('****', cart);
                    switch (cart) {

                        // 1 = MP2X
                        case config.carts.MP2X.id:
                            for (let z = 0; z < shelves[i].children.length; z++) {
                                if (shelves[i].children[z].type === config.carts.MP2X.name && shelves[i].children[z].place == place) {
                                    shelves[i].children.splice(z, 1)
                                }
                            }
                            for (let zz = 0; zz < shelves[i].carts.length; zz++) {
                                if (shelves[i].carts[zz] === config.carts.MP2X.name && zz == place) {
                                    shelves[i].carts[zz] = "default"
                                }
                            }
                            break;
                        // 2= MP2D
                        case config.carts.MP2D.id:
                            for (let z = 0; z < shelves[i].children.length; z++) {
                                if (shelves[i].children[z].type === config.carts.MP2D.name && shelves[i].children[z].place == place) {
                                    shelves[i].children.splice(z, 1)
                                }
                            }
                            for (let zz = 0; zz < shelves[i].carts.length; zz++) {
                                if (shelves[i].carts[zz] === config.carts.MP2D.name && zz == place) {
                                    shelves[i].carts[zz] = "default"
                                }
                            }
                            break;
                        // 2= PS6X'
                        // case config.carts.PS6X.id:
                        //     for (let z = 0; z < shelves[i].children.length; z++) {
                        //         if (shelves[i].children[z].type === config.carts.PS6X.name && shelves[i].children[z].place == place) {
                        //             shelves[i].children.splice(z, 1)
                        //         }
                        //     }
                        //     for (let zz = 0; zz < shelves[i].carts.length; zz++) {
                        //         if (shelves[i].carts[zz] === config.carts.PS6X.name && zz == place) {
                        //             shelves[i].carts[zz] = "default"
                        //         }
                        //     }
                        //     break;
                        //3=MP1H
                        case config.carts.MP1H.id:
                            for (let z = 0; z < shelves[i].children.length; z++) {
                                if (shelves[i].children[z].type === config.carts.MP1H.name && shelves[i].children[z].place == place) {
                                    shelves[i].children.splice(z, 1)
                                }
                            }
                            for (let zz = 0; zz < shelves[i].carts.length; zz++) {
                                if (shelves[i].carts[zz] === config.carts.MP1H.name && zz == place) {
                                    shelves[i].carts[zz] = "default"
                                }
                            }
                            break;
                        //4=TP1H
                        // case config.carts.TP1H.id:
                        //     for (let z = 0; z < shelves[i].children.length; z++) {
                        //         if (shelves[i].children[z].type === config.carts.TP1H.name && shelves[i].children[z].place == place) {
                        //             shelves[i].children.splice(z, 1)
                        //         }
                        //     }
                        //     for (let zz = 0; zz < shelves[i].carts.length; zz++) {
                        //         if (shelves[i].carts[zz] === config.carts.TP1H.name && zz == place) {
                        //             shelves[i].carts[zz] = "default"
                        //         }
                        //     }
                        //     break;
                        default:
                            orgPlace = 0
                    }
                }
            }
        }
        this.setState({ shelves: shelves })

    };

    addServices_of_demands = (type, addService, card, port, groomout_id) => {
       
        //console.log('addServices_of_demands', type, addService, card, 'port is : ', port, groomout_id);
        let newServices = [];

        // سرویس از نوع گروم هست یا نرمال اگر از نوع سرویس هست با توجه به نام کارت باید عملیات انجام شود
        //console.log('type of clint port  is : ', addService);
        if (addService === 'groomout') {
            let newServices = [];
            //console.log("grooms", port);
            let grooms = this.state.groomouts;

            // let low_rate_grooming_result = this.state.traffic.main.low_rate_grooming_result.demands;
           let cap_groomouts = this.getCapacityGrooming(this.state.low_rate_grooming_result, `${port.serviceId.id}`);

            // اضافه کردن سرویس به لیست سرویس های مورد نظر در استیت
            grooms.push({ id: grooms.length + 1, name: `groom ${grooms.length + 1}`, value: port.serviceId.id , capacity: cap_groomouts});
            //console.log("grooms.push", grooms);
            //باک کردن سرویس از ترافیک از لایت بس مورد نظر با زدن دکمه سطل زباله
            let newServicesHOmi = this.state.traffic.main.lightpaths[card.lightpathId].service_id_list.filter((service) => {
                //console.log(service.id, groomout_id, port.serviceId.id);
                if (service.id != port.serviceId.id) {
                    return service
                }
            });
            this.state.traffic.main.lightpaths[card.lightpathId].service_id_list = newServicesHOmi;
            // //console.log(this.state.demand_id,this.state.traffic.main.low_rate_grooming_result.demands[this.state.demand_id])
            // //console.log('****',this.state.traffic.main.low_rate_grooming_result.demands[this.state.demand_id].groomouts[port.serviceId.id].lightpath_id)
            // //console.log('traffic file is : ', this.state.traffic.main.lightpaths[card.lightpathId].service_id_list, port.serviceId.id, this.state.demand_id);
            //پاک کردن اتصال به کارت MP1H
            this.state.traffic.main.low_rate_grooming_result.demands[this.state.demand_id].groomouts[port.serviceId.id].lightpath_id = null;
            //اضافه کردن گروم حذف شده به فایل گروم های باقیمانده در فایل ترافیک
            this.state.traffic.main.remaining_groomouts.demands[this.state.demand_id].push(port.serviceId.id);
            this.setState({ groomouts: grooms })
        } else {
            let newServices = [];
            newServices = this.state.services.map((service, index) => {
                //console.log(service.type, addService);
                // بررسی اینکه وقتی سرویس حذف میشود از چه کارتی هستاز فایل مورد نظر سرویس حذف شود
                if (service.type == addService) {
                    if (card.textLabel === 'MP1H' || card.textLabel === 'TP1H') {
                        // اضافه کردن سرویس به لیست سرویس های مورد نظر در استیت
                        service.services.service_id_list.push(port.serviceId.id);
                        //باک کردن سرویس از ترافیک از لایت بس مورد نظر با زدن دکمه سطل زباله
                        let newServicesHOmi = this.state.traffic.main.lightpaths[card.lightpathId].service_id_list.filter((service) => {
                            if (service.id != port.serviceId.id) {
                                return service
                            }
                        });
                        this.state.traffic.main.lightpaths[card.lightpathId].service_id_list = newServicesHOmi;
                        // service.service_id_list = newServicesList;
                        return service;
                    } else {
                        //console.log('cart is mp2x in delete service', groomout_id);
                        // اضافه کردن سرویس به لیست سرویس های مورد نظر
                        service.services.service_id_list.push(port.serviceId.id);
                        //باک کردن سرویس از ترافیک از گروم اوت مورد نظر با زدن دکمه سطل زباله
                        for (const demand_of_mp2x of Object.entries(this.state.traffic.main.low_rate_grooming_result.demands)) {
                            let groomouts = demand_of_mp2x[1].groomouts;
                            if (groomouts[groomout_id]) {
                                //console.log('filter demands in mp2x traffic ', demand_of_mp2x[1]);
                                //TODO : we shoud find groomout of this service
                                for (const groom of Object.entries(groomouts)) {
                                    let filterServiceGroom_mp2x = groom[1].service_id_list.filter((service) => {
                                        //console.log(service.id, port.serviceId.id);
                                        if (service.id !== port.serviceId.id) {
                                            return service
                                        } else {
                                            //console.log('remove service')
                                        }
                                    });
                                    groom[1].service_id_list = filterServiceGroom_mp2x;
                                }
                            }
                        }
                        //TODO:اضافه کردن به ابجکت remaining
                        //console.log(this.state.traffic.main.low_rate_grooming_result.demands);
                        return service;
                    }
                } else {
                    return service;
                }
            });
            //محاسبه کپسیتی و کم کردن از کپسیتی کلی با حذف سرویس
            //console.log("cap::", this.state.traffic.main.lightpaths[card.lightpathId].capacity);
            let cap = capacity(addService);
            //console.log("what", cap);
            //console.log('cap is: ', cap, addService, this.state.traffic.main.lightpaths[card.lightpathId].capacity);
            try {
                this.state.traffic.main.lightpaths[card.lightpathId].capacity =
                    this.state.traffic.main.lightpaths[card.lightpathId].capacity - cap;
            } catch (e) {
                //console.log('error in capacity')
            }

            // //console.log('cap is: ', cap, addService, this.state.traffic.main.lightpaths[card.lightpathId].capacity);
            this.setState({ services: newServices });


        }
        //console.log('addServices_of_demands is : ', this.state, this.props)
    };

    deleteServices_of_demands = (type, removeParam, card, currentServiceList, typeLightPath, newRandom, grooming_id) => {

        //console.log('**********************deleteServices_of_demands********************');
        let newServices = this.state.services.map((service, index) => {
            if (service.id == removeParam) {
                // بس از انداختن سرویس در کارت یکی باید کم شه و مهم نیست کدام ایدی  از سرویس ها باشد
                let lastHome = service.services.service_id_list[service.services.service_id_list.length - 1];
                //console.log('lastHome is : ', service.services, lastHome)
                let newServicesList = removeFromYourArray(service.services.service_id_list, null);
                let newServiceObj = {};
                newServiceObj['id'] = lastHome;
                newServiceObj['type'] = 'normal';
                newServiceObj['serviceType'] = currentServiceList[0].type;
                if (typeLightPath === 'noHaveLightPath') {

                    //وقتی کارتی درگ  میشه یک لایت بس باید به صورت اوتوماتیک براش ساخته بشه و در فایل 
                    // service_device اضافه شود و این بخش برای کارتایی که از قبل در سیستم بوده و باید کنترل شود
                    // //console.log('this is dangerous control it ');
                    // //console.log('cart after drag service is :', card, this.state.node_structure)

                    card.lightpathId = newRandom;
                    this.state.traffic.main.lightpaths[newRandom] = {
                        id: newRandom,
                        service_id_list: [],
                        source: this.state.selectedSourceText,
                        destination: this.state.selectedDestinationText
                    };
                    this.state.traffic.main.lightpaths[newRandom].service_id_list.push(newServiceObj);
                } else {

                    if (card.lightpathId) {
                        this.state.traffic.main.lightpaths[card.lightpathId].service_id_list.push(newServiceObj);
                    } else {
                        for (const demand_of_mp2x of Object.entries(this.state.traffic.main.low_rate_grooming_result.demands)) {
                            let groomouts = demand_of_mp2x[1].groomouts;
                            if (groomouts[grooming_id]) {
                                //console.log('filter demands in mp2x traffic ', demand_of_mp2x[1]);
                                let filterServiceGroom_mp2x = groomouts[grooming_id].service_id_list.push(newServiceObj)
                            }
                        }
                        //console.log(this.state.traffic.main.low_rate_grooming_result.demands);
                    }
                }
                // //console.log('traffic is', newRandom, 'node-structure is :', node_structure)
                // //console.log('traffic is ', this.state.traffic.main.lightpaths);

                return service;
            } else {
                return service;
            }
        });

        this.setState({ services: newServices });
        //console.log('new service in deleteServices_of_demands is : ', newRandom, this.state.service_devices, this.state.traffic.main.lightpaths, this.state.node_structure);
        //console.log('new service in deleteServices_of_demands is :', this.state, this.props);
        this.basicRefresh(true);

    };

    deleteGroomout_of_demands = (type, removeParam, card, currentServiceList, typeLightPath, newRandom, grooming_id) => {
        //console.log('**********************deleteGrooms_of_demands********************', card, grooming_id, this.state.groomouts, removeParam, this.state.serviceOrGroom);

        let groomouts = this.state.groomouts;
        //console.log('deleteGroomout_of_demands ==> grooms are :  ', groomouts);
        // بس از انداختن سرویس در کارت یکی باید کم شه و مهم نیست کدام ایدی  از سرویس ها باشد
        let lastHome = groomouts[groomouts.length - 1];
        //console.log('lastHome is : ', lastHome);
        let newServicesList = removeFromYourArray(groomouts, null);
        let newServiceObj = {};
        newServiceObj['id'] = lastHome.value;
        newServiceObj['type'] = 'groomout';
        newServiceObj['serviceType'] = 'groomout';


        if (typeLightPath === 'noHaveLightPath') {

            //وقتی کارتی درگ  میشه یک لایت بس باید به صورت اوتوماتیک براش ساخته بشه و در فایل 
            // service_device اضافه شود و این بخش برای کارتایی که از قبل در سیستم بوده و باید کنترل شود
            // //console.log('this is dangerous control it ');
            // //console.log('cart after drag service is :', card, this.state.node_structure)

            card.lightpathId = newRandom;
            this.state.traffic.main.lightpaths[newRandom] = {
                id: newRandom,
                service_id_list: [],
                source: this.state.selectedSourceText,
                destination: this.state.selectedDestinationText
            };
            this.state.traffic.main.lightpaths[newRandom].service_id_list.push(newServiceObj);
        } else {

            if (card.lightpathId) {
                //console.log('newServiceObj', newServiceObj, 'card.lightpathId is : ', card.lightpathId);
                this.state.traffic.main.lightpaths[card.lightpathId].service_id_list.push(newServiceObj);
            } else {
                for (const demand_of_mp2x of Object.entries(this.state.traffic.main.low_rate_grooming_result.demands)) {
                    let groomouts = demand_of_mp2x[1].groomouts;
                    if (groomouts[grooming_id]) {
                        //console.log('filter demands in mp2x traffic ', demand_of_mp2x[1]);
                        let filterServiceGroom_mp2x = groomouts[grooming_id].service_id_list.push(newServiceObj)
                    }
                }
                //console.log(this.state.traffic.main.low_rate_grooming_result.demands);
            }
            this.setState({ groomouts: groomouts });
            //console.log('new service in groomouts_of_demands is : ', newRandom, this.state.service_devices, this.state.traffic.main.lightpaths, this.state.node_structure);
            //console.log('new service in deleteServices_of_demands is :', this.state, this.props);
            this.basicRefresh(true);
        }
    };

    createRacks = (selectedSource, node_structure) => {
        ////////////  اضاف کردن به فایل اصلی  \\\\\\\\\\
        // //console.log('node_structure IS : ', node_structure.nodes[this.state.selectedSourceText]);
        let racks_of_SelectSource = node_structure.nodes[this.state.selectedSourceText];
        let makeSlotes = createBasicShelf('object');
        /////////////////  اضافه کردن رک ها به node_structure \\\\\\\\\\\\\\\\\
        racks_of_SelectSource.racks[Object.keys(racks_of_SelectSource.racks).length] = { shelves: { 0: { slots: makeSlotes } } }
        // //console.log('node_structure is : ', racks_of_SelectSource.racks, makeSlotes);
        if (selectedSource && selectedSource != 0) {
            //console.log('createRack');

            let newArray = this.state.racks;
            let newId = newArray.length + 1;
            newArray.push({
                id: newId,
                name: `rack${newArray.length + 1}`,

            });


            ////////////ساختن شلف ها \\\\\\\\\\
            let shelfArray = [];
            let newIdShelf = shelfArray.length + 1;
            shelfArray.push({
                id: newIdShelf,
                name: `shelf${shelfArray.length + 1}`,
                children: [],
                carts: ['default', 'default', 'default', 'default', 'default', 'default', 'default']
            });
            this.setState({ shelves: shelfArray, selectedShelves: newIdShelf });
            this.setState({ racks: newArray, selectedRacks: newId });
            // //console.log('mapping3', racks_of_SelectSource.racks, this.state.racks);
            let mapping = standardMapping(this.state.selectedSourceText, this.state.racks.filter(rack => rack.id === newId),
                'new', 'new');

            this.setMappingFromHeaderTemplate(1, 1, 1, 1, mapping);


            // createBasicShelf('object');
            // this.state.node_structure.nodes[this.state.selectedSourceText].racks[newId] = {shelves: createBasicShelf('object')};
            // //console.log(this.state.node_structure.nodes[this.state.selectedSourceText])
            // //console.log('createShelves is : ', mapping)
        } else {
            alert('لطفا یک سورس مشخص کنید')
        }
        //console.log('create rack : ', this.props, this.state);
    };

    createShelves = (selectedRack, selectedSource, selectedSourceText) => {

        if (selectedRack && selectedRack != 0 && selectedSource && selectedSource != 0) {
            let newArray = this.state.shelves;
            let newId = newArray.length + 1;
            newArray.push({
                id: newId,
                name: `shelf${newArray.length + 1}`,
                children: [],
                carts: ['default', 'default', 'default', 'default', 'default', 'default', 'default']
            });
            this.setState({ shelves: newArray, selectedShelves: newId });

            let mapping = standardMapping(this.state.selectedSourceText, standardRacks(this.state.racks).filter(rack => rack.id === parseInt(selectedRack)),
                newArray.filter(shelf => shelf.id === newId), this.state.lightPath_of_currentShelfWithService);
            this.setMappingFromHeaderTemplate(1, 1, 1, 1, mapping);
            this.setState({ mapping: mapping })
            // //console.log('createShelves is : ', mapping)
        } else {
            alert('لطفا یک سورس و یک رک مشخص کنید')
        }

        ///////////////  ایجاد تغییر در فایل اصلی \\\\\\\\\\
        //console.log(selectedSource, selectedRack, this.state.selectedShelves, this.state.service_devices);
        addShelfInServiceDevice(this.state.service_devices, selectedSourceText, selectedRack, this.state.node_structure);
        // //console.log('node structure after create shelf', this.state.node_structure)
        //console.log('create rack : ', this.props, this.state);
    };

    FromDetailTemplate = (keyFromDetail, e, column) => {

        if (keyFromDetail === 'LOVSearch') {

            if (column === 'shelves') {
                this.setState({ selectedShelves: e.target.value });
            }
        }
        if (keyFromDetail === 'LOV') {

            if (column === 'shelves') {
                this.setState({ selectedShelves: e.target.value });
            }
        }

    };

    selectedNetworkPanelsFromDetail = (selectedNetworkPanels) => {
        this.setState({ selectedNetworkPanels: selectedNetworkPanels })
    };

    selectedCurrentServiceFromDetail = (selectedCurrentServiceId) => {
        this.setState({ selectedCurrentService: selectedCurrentServiceId, serviceOrGroom: 'service' })
    };

    selectedCurrentGroomoutFromDetail = (selectedCurrentGroomoutId) => {
        this.setState({ selectedCurrentGroomout: selectedCurrentGroomoutId, serviceOrGroom: 'groomout' })
    };

    finalInformationTemplate = async () => {

        let deepClone_node_structure = JSON.parse(JSON.stringify(this.state.node_structure));
        let new_node_structure = node_structure_mapping_final(deepClone_node_structure);
        // //console.log('finalInformationTemmplate node_structure is : ', this.state.node_structure);
        //console.log('finalInformationTemmplate node_structure is : ', new_node_structure);
        //console.log('finalInformationTemmplate service_devices is : ', this.state.service_devices);
        //console.log('finalInformationTemmplate traffic is :', this.state.traffic);
        const apiURL = config.ipAddress.sinaLocalNetwork;
        const token_body = new URLSearchParams();
        token_body.append('username', 'amir');
        token_body.append('password', '1234');
        const token_config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        const token_result = await axios.post(`${apiURL}/v2.0.0/users/login`, token_body, token_config);
        const access_token = token_result.data.access_token;
        const token_type = token_result.data.token_type;
        const grooming_config = {
            headers: { "Authorization": `${token_type} ${access_token}` }
        };
        const grooming_result = await axios.post(`${apiURL}/v2.0.0/algorithms/grooming/manual/end_to_end?project_id=kerman`, {
            traffic: this.state.traffic,
            service_devices: this.state.service_devices,
            node_structure: new_node_structure,
            form: {
                comment: "****"
            }
        }, grooming_config)
            .then((result) => {
                //console.log('result is : ', result)

            })
            .catch((error) => {
                //console.log('error is  :', error)
            });
        // this.componentDidMount()
    };

    render() {
        // //console.log('%c state in template is :', 'color: red', this.state.lightPathes);
        // //console.log('%c state in template is :', 'color: green', this.state,this.props);

        return (
            <div className="mainTemplate">
                {this.state.loading ? <Loading /> : null}
              
                <Header lock={this.state.lock} traffic={this.state.traffic} service_devices={this.state.service_devices}
                    node_structure={this.state.node_structure}
                    demands={this.state.demands}
                    setMappingFromHeaderTemplate={this.setMappingFromHeaderTemplate}
                    standardMapping={this.standardMapping}
                    basicFill_lightPath_of_currentShelfWithService={this.basicFill_lightPath_of_currentShelfWithService}
                    basicFillShelves2={this.basicFillShelves2} basicFillLightPath={this.basicFillLightPath}
                    basicFillShelves={this.basicFillShelves}
                    basicFillRack={this.basicFillRack}
                    source={this.state.source} basicFillServices={this.basicFillServices}
                    selected={(this.state.selectedShelves != null ? this.state.selectedShelves : "")}
                    selectedRacks={(this.state.selectedRacks != null ? this.state.selectedRacks : "")}
                    FromDetailTemplate={this.FromDetailTemplate} shelves={this.state.shelves} racks={this.state.racks}
                    createRacks={this.createRacks}
                    createShelves={this.createShelves}
                    basicFillSelectedRacks={this.basicFillSelectedRacks}
                    basicFillSelectedDestination={this.basicFillSelectedDestination}
                    basicFillGrooming={this.basicFillGrooming}
                    basicFillDemand={this.basicFillDemand}
                    finalInformationTemplate={this.finalInformationTemplate}
                    demand_id={this.state.demand_id} />

                <div>

                    <LeftTemp selectedCurrentServiceFromDetail={this.selectedCurrentServiceFromDetail}
                        selectedNetworkPanelsFromDetail={this.selectedNetworkPanelsFromDetail}
                        selectedCurrentGroomoutFromDetail={this.selectedCurrentGroomoutFromDetail}
                        selectedShelves={this.state.selectedShelves} shelves={this.state.shelves} key={'leftTemp'}
                        addmp2x={this.addmp2x}
                        deletemp2x={this.deletemp2x}
                        lightPathes={this.state.lightPathes}
                        services={this.state.services}
                        groomouts={this.state.groomouts}
                    />
                     {console.log('lightPathes.map-template', this.state.lightPathes)}
                    <RightTemp basicRefresh={this.basicRefresh}
                        ref={this.child_rightTemp} setMappingCart={this.setMappingCart} mapping={this.state.mapping}
                        lightPath_of_currentShelfWithService={this.state.lightPath_of_currentShelfWithService}
                        deletemp2x={this.deletemp2x} addmp2x={this.addmp2x}
                        selectedNetworkPanels={this.state.selectedNetworkPanels}
                        selectedCurrentService={this.state.selectedCurrentService}
                        selectedShelves={this.state.selectedShelves} shelves={this.state.shelves}
                        services={this.state.services}
                        groomouts={this.state.groomouts}
                        addServices_of_demands={this.addServices_of_demands}
                        deleteServices_of_demands={this.deleteServices_of_demands}
                        deleteGroomout_of_demands={this.deleteGroomout_of_demands}
                        key={'rightTemp'}
                        traffic={this.state.traffic}
                        basicFillServiceDevice={this.basicFillServiceDevice}
                        service_devices={this.state.service_devices}
                        node_structure={this.state.node_structure}
                        selectedSourceText={this.state.selectedSourceText}
                        selectedDestinationText={this.state.selectedDestinationText}
                        selectedSource={this.state.selectedSource}
                        selectedRacks={this.state.selectedRacks}
                        basicFillServices={this.basicFillServices}
                        serviceOrGroom={this.state.serviceOrGroom}
                        demands={this.state.demands}
                        demand_id={this.state.demand_id}
                        basicFillGrooming={this.basicFillGrooming}
                        basicFillLightPath={this.basicFillLightPath}
                        lightPathes={this.state.lightPathes}
                        lightpath_cap={this.basicFillLightPath_cap}
                        groomouts_cap={this.basicFillGroomouts_cap}
                    />

                </div>
                {/*<Footer/>*/}
            </div>
        );
    }
}

export default Template;
