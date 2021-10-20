import React from 'react';
import TableLOV from "./../../Table2/TableLOV/TableLOV";
import './Header.css';
import { FaCalendarPlus } from "react-icons/fa";
import {
    destinations_of_selectedSource,
    filter_useLightPath_from_allLightPath_in_source,
    lightPash_of_demand_of_trafics_,
    lightPath_of_demand_of_traffics,
    racks_of_serverFile,
    services_of_demands,
    standardDestination,
    standardMapping,
    standardRacks,
    standardShelves, unUseServicesInDemands, unUseServicesInDemands_MP2X
} from "../../../utils/util";
import StationUtility from "../Modules/StationUtility";
// import postList from './../../services/PostList';
import axios from "axios";
import Loading from "../../Table2/loading/Loading";
import { demandsServerCheck, find_demandId_from_source_destination } from "../../../utils/demandsUtil/demandsUtil";
import { service_deviceServerCheck } from "../../../utils/service_deviceUtil/service_deviceUtil";
import { filter_grooming_demands, trafficServerCheck } from "../../../utils/trafficUtil/trafficUtil";

class Header extends React.Component {

    stationUtility = new StationUtility([]);

    state = {
        demands: this.props.demands,
        service_devices: this.props.service_devices,
        traffic: this.props.traffic,
        selectedSource: null,
        selectedSourceText: null,
        selectedDestinationText: null,
        selectedDestination: null,
        destination: [],
        selectedRack: null,
        defaultRack: 1,
        defaultShelve: 1,
        defaultDestination: 0,
        rack: [],
        loading: false
    };

 
    FromDetail = async (keyFromDetail, e, column) => {

        if (keyFromDetail === 'LOVSearch') {
            // //console.log('LOVSearch');
            if (column === 'source') {
                this.setState({ selectedSource: e.target.value });
            }
            if (column === 'destination') {
                this.setState({ selectedDestination: e.target.value });
            }
        }

        function defaultRack(ref, newRack, defaultRack) {
            let newDefaultRack = 0;
            if (newRack.length > 0) {
                ref.state.selectedRack = defaultRack;
                newDefaultRack = defaultRack
            } else {
                ref.state.selectedRack = 0;
                newDefaultRack = 0
            }
            return newDefaultRack;
        }

        function defaultShelve(ref, newShelve, defaultShelve) {
            let newDefaultShelve = 0;
            if (newShelve.length > 0) {
                ref.state.selectedShelves = defaultShelve;
                newDefaultShelve = defaultShelve
            } else {
                ref.state.selectedShelves = 0;
                newDefaultShelve = 0
            }
            return newDefaultShelve;
        }

        function defaultDestination(ref, newDestination, defaultDestination, destinationText) {
            let newDefaultDestination = 0;
            if (newDestination.length > 0) {
                ref.state.selectedDestination = defaultDestination;
                ref.state.selectedDestinationText = '';
                newDefaultDestination = defaultDestination
            } else {
                ref.state.selectedDestination = 0;
                ref.state.selectedDestinationText = '';
                newDefaultDestination = 0
            }
            return newDefaultDestination;
        }

        if (keyFromDetail === 'LOV') {

            if (column === 'source') {
                let demands = this.props.demands;
                let service_devices = this.props.service_devices;
                let node_structure = this.props.node_structure;
                let traffic = this.props.traffic;
                //console.log('node_structure', node_structure);
                //console.log('traffic', traffic);
                //console.log('demands', demands);
                //console.log('service_devices', service_devices);
                // demands = demandsServerCheck(this.props.demands);
                // service_devices = service_deviceServerCheck(this.props.service_devices);
                // traffic = trafficServerCheck(this.props.traffic);
                this.setState({ selectedSource: e.target.value });
                //با انتخاب هر سورس لیست مقصدها باید بیرون کشیده شود
                //=============================== ساختن لیستی از مقصد ها ===============================
                let destination = [];
                let selectedSource = null;
                let selectedSource_element = e.target.children[e.target.value];
                if (selectedSource_element) {
                    this.state.selectedSourceText = selectedSource_element.text;
                    selectedSource = selectedSource_element.text;
                    destination = destinations_of_selectedSource(demands, selectedSource_element.text)
                }
                let newDestination = standardDestination(destination);
                this.setState({ destination: newDestination });
                //======================================================================================
                //TODO:before change
                // //console.log('service_devices', service_devices);
                //TODO:after Change
                // //console.log('node_structure', node_structure);
                if (node_structure) {
                    if (node_structure.nodes) {
                        if (node_structure.nodes[selectedSource]) {
                            //تعداد کل رک ها
                            let racks = racks_of_serverFile(selectedSource, node_structure);
                            //********************* ساختن رک ها *********************
                            let newRack;
                            if (Object.keys(racks).length > 0) {
                                newRack = standardRacks(racks);
                                //newRack==>این ارایه با استفاده از متد بالا به ترتیب رک هارو از فایل میخوته و چون در فایل ای دی ندارند به صورت
                                // اتوماتیک از 1 شماره گذاری میکند برای LOV
                                //racks ==> در واقع رک های موجود در فایل که از صفر شماره گذاری شده
                                //result==> برای پیدا کردن رک درفایل با استفاده ز فایل پیش فرض همیشه باید یک مقدار رو کم کرد تا به
                                //رک مورد نظر برسیم
                                let newDefaultRack = defaultRack(this, newRack, this.state.defaultRack);
                                defaultDestination(this, newDestination, this.state.defaultDestination, this.state.selectedDestinationText);
                                if (racks[newDefaultRack - 1]) {
                                    let defaultRackSelect = racks[newDefaultRack - 1];
                                    let shelves = defaultRackSelect['shelves'];
                                    let count_of_shelves_racks_of_node = Object.keys(shelves).length;
                                    //********************* ساختن شلف های رک انتخاب شده از سورس *********************
                                    // //console.log('shelves are : ', shelves);
                                    // //console.log('count_of_shelves_racks_of_node is : ', count_of_shelves_racks_of_node);
                                    let newShelve = standardShelves(shelves);

                                    defaultShelve(this, newShelve, this.state.defaultShelve);
                                    // let lightPathes;
                                    // let newLightPathes = [];
                                    //console.log("traffic.main.lightpaths",traffic.main.lightpaths);
                                    let newLightPathesTrafic = lightPath_of_demand_of_traffics(traffic.main.lightpaths, this.state.selectedSourceText, this.state.selectedDestinationText);
                                    //console.log('newLightPathesTrafic is : ', newLightPathesTrafic);
                                    //============================  services_of_demands  ================================
                                    // let newServices = services_of_demands(this.state.selectedSourceText, this.state.selectedDestinationText);
                                    // //console.log('new services is in source:', newServices);
                                    //=================================================================================
                                    let useLightPath_shelves = filter_useLightPath_from_allLightPath_in_source(this.state.selectedSourceText,
                                        newDefaultRack, this.state.selectedShelves, demands, traffic, service_devices, node_structure);
                                    //console.log('useLightPath_shelves is : ', useLightPath_shelves);
                                    //newShelve => همون لیستی از shelf هاست
                                    this.props.basicFillShelves(newShelve, newLightPathesTrafic, newRack, selectedSource, selectedSource_element.text, newDefaultRack);
                                    this.props.basicFillServices([]);
                                    this.props.basicFillGrooming([]);
                                    this.props.basicFill_lightPath_of_currentShelfWithService(useLightPath_shelves);
                                    this.props.basicFillSelectedDestination('', '');
                                    //وقتی سورس انتخاب میشه ما فقط خونه های اول رک ها و شلفها رو میخوایم

                                    let mapping = standardMapping(selectedSource, newRack, newShelve, useLightPath_shelves);
                                    //console.log('***********', mapping, selectedSource, newRack, newShelve, useLightPath_shelves);
                                    this.props.setMappingFromHeaderTemplate(1, 1, 1, 1, mapping);
                                }
                            } else {
                                //console.log('برای این سورس رکی وجود ندارد...')
                            }
                        } else {
                            //اگر هیچ سورسی انتخاب نشود بقیه lov عا باد خانه ی اول شود
                            this.state.selectedRack = 0;
                        }
                    }
                }
                //============================================================
            }

            if (column === 'destination') {
                let demands = this.props.demands;
                let service_devices = this.props.service_devices;
                let node_structure = this.props.node_structure;
                let traffic = this.props.traffic;
                // //console.log('traffic', traffic)
                this.setState({ selectedDestination: e.target.value });
                let selectedDestination_element = e.target.children[e.target.value];
                let selectedDestination = null;
                if (selectedDestination_element) {
                    this.state.selectedDestinationText = selectedDestination_element.text;
                    selectedDestination = selectedDestination_element.text;
                    let newLightPathesTrafic = lightPath_of_demand_of_traffics(traffic.main.lightpaths, this.state.selectedSourceText, this.state.selectedDestinationText);
                    //============================  services_of_demands  ================================
                    //کل سرویس های موجود در دیمندز
                    let newServices = services_of_demands(this.state.selectedSourceText, this.state.selectedDestinationText, demands);
                    //console.log('services_of_demands is : ,', newServices);
                    let unUseServices = unUseServicesInDemands(newServices, traffic.main.lightpaths);
                    //console.log('unUseServicesInDemands is : ,', unUseServices);
                    let unUseServicesInMP2X = unUseServicesInDemands_MP2X(newServices, traffic.main.low_rate_grooming_result.demands);
                    //console.log('unUseServicesInMP2X is : ,', unUseServicesInMP2X);
                    let demand_id = find_demandId_from_source_destination(demands, this.state.selectedSourceText, this.state.selectedDestinationText);
                    //console.log('demand_id is :', demand_id);
                    let groomList = filter_grooming_demands(traffic.main.remaining_groomouts.demands, demand_id.id);
                    //newServices در دو تابع بالا دست کاری میشود
                    this.props.basicFillServices(newServices);
                    this.props.basicFillDemand(demand_id.id);
                    this.props.basicFillGrooming(groomList);
                    this.props.basicFillLightPath(newLightPathesTrafic);
                    this.props.basicFillSelectedDestination(e.target.value, selectedDestination_element.text)
                }
            }
            if (column === 'rack') {
                let demands = this.props.demands;
                let service_devices = this.props.service_devices;
                let node_structure = this.props.node_structure;
                let traffic = this.props.traffic;
                //console.log('selected rack is & service_devices: ', e.target.value, node_structure, this.state.selectedSourceText);
                if (this.state.selectedSourceText) {
                    if (node_structure.nodes[this.state.selectedSourceText]) {
                        //تعداد کل رک ها
                        let rack = racks_of_serverFile(this.state.selectedSourceText, node_structure);
                        // let rack = this.props.racks;
                        //console.log('racks are : ', rack);
                        //رک انتخابی در فایل کانفیگ از 0 شروع میشود که چون ای دی رک انتخابی در lov از 1 شروع میشود باید یکی کم کرد
                        let racks = [];
                        if (parseInt(e.target.value) !== 0) {
                            racks = rack[parseInt(e.target.value) - 1];
                        } else {

                        }
                        if (racks) {
                            if (Object.keys(racks)) {
                                if (Object.keys(racks).length > 0) {
                                    let shelves = racks['shelves'];
                                    let count_of_shelves_racks_of_node = Object.keys(shelves).length;
                                    //********************* ساختن شلف های رک انتخاب شده از سورس *********************
                                    //console.log('shelves are : ', shelves);
                                    //console.log('count_of_shelves_racks_of_node is : ', count_of_shelves_racks_of_node);
                                    let newShelve = standardShelves(shelves);
                                    // let lightPathes;
                                    // let newLightPathes = [];
                                    let newLightPathesTrafic = lightPath_of_demand_of_traffics(traffic.main.lightpaths, this.state.selectedSourceText, this.state.selectedDestinationText);
                                    //============================  services_of_demands  ================================
                                    let newServices = services_of_demands(this.state.selectedSourceText, this.state.selectedDestinationText, demands);
                                    //console.log('new services is :', newServices);
                                    //=================================================================================
                                    //newShelve => همون لیستی از shelf هاست
                                    this.props.basicFillShelves2(newShelve, newLightPathesTrafic);
                                    this.props.basicFillServices(newServices);
                                    this.props.basicFillSelectedRacks(e.target.value);
                                    //console.log('shelves are : ', newShelve);
                                    // //console.log('lightPathes are : ', newLightPathes);
                                    //console.log('newLightPathesTrafic are : ', newLightPathesTrafic);
                                    let useLightPath_shelves = filter_useLightPath_from_allLightPath_in_source(this.state.selectedSourceText, parseInt(e.target.value),
                                        this.state.selectedShelves, demands, traffic, service_devices, node_structure);
                                    //اسم سورس - ارایه رک انتخاب شده به صورت استاندارد - ارایه شلو استاندارد شده

                                    let mapping = standardMapping(this.state.selectedSourceText, standardRacks(rack).filter(rack => rack.id === parseInt(e.target.value)),
                                        newShelve.filter(shelf => shelf.id === 1), useLightPath_shelves);
                                    // //console.log('mapping in rack : ', mapping, rack, newShelve, this.state.selectedShelves);
                                    // چون فقط اطلاعات مورد نظر ذخیره میشود پس همیشه رک 1 و شلف 1 پاس داده میشودولی چون با ایدی ذخیره میشود مجبوریم ایدی موردنظر رو بفرستیم
                                    //console.log('mapping in rack is : ', mapping);
                                    this.props.setMappingFromHeaderTemplate(1, parseInt(e.target.value), 1, 1, mapping);
                                }
                            }
                        }

                    } else {
                        //اگر هیچ سورسی انتخاب نشود بقیه lov عا باد خانه ی اول شود
                        this.state.selectedRack = 0;
                    }
                }
                this.setState({ selectedRack: e.target.value });
            }
            if (column === 'shelves') {
                let demands = this.props.demands;
                let service_devices = this.props.service_devices;
                let node_structure = this.props.node_structure;
                let traffic = this.props.traffic;
                this.props.FromDetailTemplate(keyFromDetail, e, column);
                let useLightPath_shelves = filter_useLightPath_from_allLightPath_in_source(this.state.selectedSourceText, this.state.selectedRack,
                    e.target.value, demands, traffic, service_devices, node_structure);
                this.props.basicFill_lightPath_of_currentShelfWithService(useLightPath_shelves, e.target.value);
                let rack = racks_of_serverFile(this.state.selectedSourceText, node_structure);
                let racks = [];
                if (parseInt(e.target.value) !== 0) {
                    racks = rack[parseInt(this.state.selectedRack) - 1];
                }
                let shelves;
                if (racks) {
                    shelves = racks['shelves'];

                } else {
                    shelves = [];
                }
                let newShelve = standardShelves(shelves);
                let mapping = standardMapping(this.state.selectedSourceText, standardRacks(rack).filter(rack => rack.id === parseInt(this.state.selectedRack)),
                    newShelve.filter(shelf => shelf.id == e.target.value), useLightPath_shelves)
                this.props.setMappingFromHeaderTemplate(1, parseInt(this.state.selectedRack), parseInt(e.target.value), 1, mapping);
            }
        }
    };

    finalInformation = () => {
        //console.log('final information');
        this.props.finalInformationTemplate();
    };

    createRacks = (selectedSource, node_structure) => {
        if (this.props.racks && Array.isArray(this.props.racks)) {
            //زمانی که دکمه ساخته شدن رک زده میشه تعداد کل رک ها گرفته میشه به علاوه ۱ میشه
            // و در پارامتر selectedRack که در واقع ورودی برای انتخا لیست است قرارداده میشود
            this.setState({ selectedRack: this.props.racks.length + 1 });
            //ایجاد رک جدید و با کد بالا همزمان به کامپوننت پایین ارسال میشود
            this.props.createRacks(selectedSource, node_structure)
        } else {
            // //console.log('error in create button rack')
        }
    };

    render() {
        let selectColumns = {
            select: 'select',
            columns: ['source', 'destination', 'shelves', 'rack'],
            type: 'LOV',
            search: false,
            path: [{
                source: this.props.source,
                show: 'name',
                set: 'id',
                server: 'server'
            }, {
                destination: this.state.destination,
                show: 'name',
                set: 'id',
                server: 'server'
            }, {
                shelves: this.props.shelves,
                show: 'name',
                set: 'id',
                server: 'server'
            }, {
                rack: this.props.racks,
                show: 'name',
                set: 'id',
                server: 'server'
            }]
        };
        
        return <div className={'bodyOfHeader'}>
            {this.state.loading ? <Loading /> : null}
            <fieldset className={'box source'}>
                <legend>Source</legend>
                <TableLOV pk={`select${'source'}`} type={selectColumns.type} search={selectColumns.search}
                    FromDetailForAddUserForm={this.FromDetail}
                    orgKey={'source'}
                    selected={(this.state.selectedSource != null ? this.state.selectedSource : "")}
                    orgIndex={'source'} selectOptions={selectColumns.path[0]} />
            </fieldset>


            <fieldset className={'box dest'}>
                <legend>Destination</legend>
                <TableLOV className="form-control" pk={`select${'destination'}`} type={selectColumns.type} search={selectColumns.search}
                        FromDetailForAddUserForm={this.FromDetail}
                        orgKey={'destination'}
                        selected={(this.state.selectedDestination != null ? this.state.selectedDestination : "")}
                        orgIndex={'destination'} selectOptions={selectColumns.path[1]} />
            </fieldset>

            {/* <div className={'demand'}>
                <label>{`demand_id : ${this.props.demand_id}`}</label>
            </div> */}

            <fieldset className={'box rack'}>
                <legend>Create Rack</legend>
                <TableLOV className="form-control" pk={`select${'rack'}`} type={selectColumns.type} search={selectColumns.search}
                    FromDetailForAddUserForm={this.FromDetail}
                    orgKey={'rack'}
                    selected={(this.state.selectedRack != null ? this.state.selectedRack : "")}
                    orgIndex={'rack'} selectOptions={selectColumns.path[3]} />
                <button className="btn-create" onClick={() => {
                    this.createRacks(this.state.selectedSource, this.props.node_structure)
                }}>Create Rack
                </button>
            </fieldset>

            <fieldset className={'box shelves'}>
                <legend>Create Shelves</legend>

                <TableLOV className="form-control" pk={`select${'shelves'}`} type={selectColumns.type} search={selectColumns.search}
                    FromDetailForAddUserForm={this.FromDetail}
                    orgKey={'shelves'}
                    selected={this.props.selected}
                    orgIndex={'shelves'} selectOptions={selectColumns.path[2]} />

                <button className="btn-create" onClick={() => {
                    this.props.createShelves(this.state.selectedRack, this.state.selectedSource, this.state.selectedSourceText)
                }}>Create Shelf
                </button>
            </fieldset>
         
            <div>
                <button className="btn btn-success send-final-info btn-create" style={{ marginLeft: '5px', marginRight: '5px' }} onClick={this.finalInformation}>
                    <FaCalendarPlus style={{ paddingRight: '5px', fontSize: '20px'}}/>Send Final Information
                </button>
            </div>

        </div>
    }
}

export default Header;