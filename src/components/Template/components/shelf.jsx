import React from 'react';
import Card from "./card";
import _, { range } from 'lodash';
import DragAndDrop from "../Modules/DragAndDrop";
import CartDragable from "./CartDragable";
import {
    addCartInShelfInServiceDevice,
    deleteCartInShelfInServiceDevice, findCart_in_service_device_file
} from "../../../utils/service_deviceUtil/service_deviceUtil";
import { service_devices } from '../../../config';
import { checkGroomoutIsThereInTraffic, checkLightPathIsThereInTraffic } from "../../../utils/trafficUtil/trafficUtil";
import {
    find_demandId_from_source_destination
} from "../../../utils/demandsUtil/demandsUtil";
import { removeFromYourArray } from "../../../utils/util";

var randomize = require('randomatic');
const selectHighlight = "float-right border border-danger"

//@par: cardArr: an array of cards, shelfCap: card capacity of a shelf
export class Shelf extends DragAndDrop {
    state = {
        cardArr: [],
        shelfCap: 0,
        saveState: false,
        delCardRep: [],
        pendingCard: 0
    };

    prevLeftClick = false;

    emptyCard = { card: { ...this.props.cardStorage.find(card => card.textLabel === "") } };

    componentDidMount() {

        this.setState({ cardArr: this.props.cardArr, shelfCap: this.props.shelfCap });
        this.makeShelf(this.props.cardArr, this.props.shelfCap);
        document.addEventListener("keydown", this.handleEscEvent, false);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //console.log('%c componentDidUpdate shelf! ', 'background: yellow; color: #ba1a55', '##3', 'prevProps.cardArr', prevProps.cardArr, 'props', this.props.cardArr, 'state', this.state.cardArr, '##3');
        if (prevState.cardArr !== this.state.cardArr && this.state.saveState) {
            //TODO:واقعا نیازی نیست استیته قبل و باس بدیم ولی خوب مجبوریم بدیم شاید اقای تقیه دلیلی داشته
            //console.log('prec', prevState, this.state)
            window.confirm("Do you want to save the changes?") ? this.onSave(this.state) : this.onCancel(prevProps);
        }
        if (prevProps.cardArr !== this.props.cardArr) {

            // //console.log('111111111111111')
            this.makeShelf(this.props.cardArr, this.props.shelfCap);
        }
    }

    makeCardSlot(id) {
        return { id: id, ...this.emptyCard }
    }

    makeEmptyShelf(shelfCap) {
        const ports = range(1, shelfCap + 1);
        const cardArr = ports.map(elem => this.makeCardSlot(elem));

        return cardArr.concat();
    }

    makeShelf = (cardArr, shelfCap) => {

        const shelf = this.makeEmptyShelf(shelfCap);

        // cardArr تمام اسلاتهاست که میشه ۱۴ تا ===> elem
        // cardArr.forEach((elem) => {
        //
        //     shelf.splice(shelf.findIndex(item => item.id === elem.id), Math.ceil(elem.card ? elem.card.size : 1), elem)
        //
        // });
        let counter = 0;
        let newCardArr = [];
        if (cardArr.length === 0) {
            newCardArr = shelf

            newCardArr.map((row, index) => {
                row.id = row.id - 1;
                return row;
            })

        }


        if (0 < cardArr.length && cardArr.length < 14) {


            cardArr.map((row, index) => {

                let newRow = row;
                if (row.card.size === 2) {
                    newCardArr.push(newRow);
                    newCardArr.push({
                        id: newRow.id + 1,
                        card: row.card,
                        lightpathId: row.lightpathId ? row.lightpathId : ""
                    });
                } else {
                    newCardArr.push(row);
                }
            })

            let newCardArr2 = []
            newCardArr.map((row, index) => {


                if (row.card.size == "") {
                    // row = { ...row, id: row.id + 1 };
                    newCardArr2.push(row);
                    return row;
                }


                if (row.card.size == 1) {
                    // row = { ...row, id: row.id + 1 };
                    newCardArr2.push(row);
                    return row;
                }

                if (row.card.size == 2 && counter === 0) {

                    counter = 1;
                    // row = { ...row, id: row.id + 1 };
                    newCardArr2.push(row);
                    return row;
                }
                if (row.card.size == 2 && counter === 1) {

                    counter = 0;
                    // newCardArr.push(row);
                    return row;
                }


            });

            newCardArr = newCardArr2;
        }

        if (cardArr.length === 14) {
            cardArr.map((row, index) => {


                if (row.card) {
                    if (row.card.size == "") {
                        // row = { ...row, id: row.id + 1 };
                        newCardArr.push(row);
                        return row;
                    }

                    if (row.card.size == 1) {
                        // row = { ...row, id: row.id + 1 };
                        newCardArr.push(row);
                        return row;
                    }

                    if (row.card.size == 2 && counter === 0) {

                        counter = 1;
                        // row = { ...row, id: row.id + 1 };
                        newCardArr.push(row);
                        return row;
                    }
                    if (row.card.size == 2 && counter === 1) {

                        counter = 0;
                        // newCardArr.push(row);
                        return row;
                    }
                }


            });

        }

        this.setState({ cardArr: newCardArr });

    };

    addCard(nextCard, id) {

        if (id + Math.ceil(nextCard.size) - 1 > this.state.shelfCap) {
            alert("Out of capacity. Please select another port or shelf.");
            return;
        }
        const cardArr = this.state.cardArr.concat();
        range(0, cardArr.length) // Disassemble slots that we need to change them
            .filter(num => cardArr[num].id - id < Math.ceil(nextCard.size) && cardArr[num].id - id >= 0)
            .forEach(num => {
                if (cardArr[num]) {
                    const size = Math.ceil(cardArr[num].card.size);
                    const repArr = range(0, size).map(item => this.makeCardSlot(cardArr[num].id + item));
                    cardArr.splice(num, 1, ...repArr)
                }
            });
        const index = cardArr.findIndex(elem => elem.id === id);
        cardArr.splice(index, Math.ceil(nextCard.size), { id: id, card: nextCard }); // Import selected card
        this.state.cardArr = cardArr.concat();
    }

    onCancel = (props) => {
        this.makeShelf(props.cardArr, props.shelfCap);
        this.setState({ saveState: false, delCardRep: [] });
        this.props.setChangeState(true);
    }

    onSave = (state) => {
        this.props.onSave(state.cardArr, state.delCardRep);
        this.setState({ saveState: false, delCardRep: [] });
        this.props.setChangeState(true);
    }

    isEmpty() {
        let counter = 0;
        this.state.cardArr.forEach(item => counter = (item.card ? item.card.textLabel : '') === "" ? counter + 1 : counter);
        return counter === this.state.shelfCap;
    }

    changeCard(card, id) {
        let cart = this.state.cardArr.find(item => item.id === id)

        if (cart && card) {

            if (this.props.canAddCard && cart.card.textLabel !== card.textLabel) {

                const delRep = this.state.delCardRep.concat();
                delRep.push(id);
                this.addCard(card, id);
                this.state.saveState = true;
                this.setState(this.state, () => this.setState({ delCardRep: delRep }));
                this.props.setChangeState(false);
            }
        }
    }

    drop(ev, arr, id, drop, everyCart) {
        //console.log('$$$$$$$$$$$$$$$cart drag and saveState is : ', this.state.saveState, ev, arr, id, drop, everyCart);
        if (this.state.saveState === false) {
            if (this.props.selectedDestinationText && this.props.selectedSourceText) {
                let card = super.drop(ev, arr, drop);
                this.changeCard(card, id);
                // اینجا ما باید یه کارت به فایل اصلی اضافه کنیم
                let newRandomForServiceDevice = randomize('a0', 32);
                //console.log('newRandomForServiceDevice is : ', newRandomForServiceDevice);
                let out = addCartInShelfInServiceDevice(this.props.node_structure, this.props.selectedSource, this.props.selectedRacks,
                    this.props.selectedShelves, id, card.textLabel, this.props.service_devices, newRandomForServiceDevice, this.props.selectedDestinationText, this.props.traffic, this.props.demand_id);
                //ساختن لایت بس برای کارتی جدیدا درگ شده است
                let newCardArr = this.state.cardArr.map((row, index) => {
                    if (row.id === everyCart.id) {
                        row.lightpathId = newRandomForServiceDevice;
                        row.card['lightpathId'] = newRandomForServiceDevice;
                        return row;
                    } else {
                        return row;
                    }

                });
                //و اضافه کردن در گروم ها
                if (card.textLabel === 'MP1H' || card.textLabel === 'TP1H' || card.textLabel === 'MP2D') {
                    //console.log('lightPathes of demands are', this.props.lightPathes);
                    let newId = this.props.lightPathes.length + 1
                    let obj = {
                        id: newId,
                        name: this.props.selectedDestinationText + ' ' + newId,
                        type: this.props.selectedDestinationText + ' ' + newId,
                        lightPath: out.lightPath,
                        source: this.props.selectedSourceText,
                        destination: this.props.selectedDestinationText
                    }
                    this.props.lightPathes.push(obj)
                    this.props.basicFillLightPath(this.props.lightPathes)

                } else if (card.textLabel === 'MP2X') {
                    let new_id = this.props.groomouts.length + 1;
                    this.props.groomouts.push({
                        id: new_id,
                        name: `groom ${new_id}`,
                        value: out.groom1
                    });
                    this.props.groomouts.push({
                        id: new_id + 1,
                        name: `groom ${new_id + 1}`,
                        value: out.groom2
                    });
                    this.props.basicFillGrooming(this.props.groomouts)
                }

                //console.log('grooms are : ', this.props.groomouts);

                this.props.basicRefresh(true);
            } else {
                alert('لطفا مبدا و مقصد را مشخص کنید...')
            }
        } else {
            alert('لطفا اطلاعات را سیو یا کنسل کنید')
        }

    }

    handleOnCardLeftClick = (ev, id) => {

        //console.log('handleOnCardLeftClick');
        ev.preventDefault();
        if (!this.prevLeftClick) {
            const card = this.state.cardArr.find(card => card.id === id).card;
            if (card.textLabel === "") {
                return null;
            }
            this.props.setSelectedCard(id, card);
        }
        this.prevLeftClick = false;
        // deleteCartInShelfInServiceDevice(this.props.node_structure, this.props.selectedSource, this.props.selectedRacks, this.props.selectedShelves, id, this.props.service_devices)
    }

    setPrevLeftClick = (setBoolean) => {
        this.prevLeftClick = setBoolean;
    }

    conMen(ev, id, elem) {
        //console.log('delete cart...', id, elem, this.props.groomouts);
        if (this.props.selectedDestinationText) {
            let demand = find_demandId_from_source_destination(this.props.demands, this.props.selectedSourceText, this.props.selectedDestinationText);
            if (elem.lightpathId) {
                let current_lightPath = this.props.traffic.main.lightpaths[elem.lightpathId];
                if (current_lightPath.source === this.props.selectedSourceText && current_lightPath.destination === this.props.selectedDestinationText
                    ||
                    current_lightPath.source === this.props.selectedDestinationText && current_lightPath.destination === this.props.selectedSourceText) {
                    ev.preventDefault();
                    this.changeCard(this.emptyCard.card, id);
                    let cart = findCart_in_service_device_file(this.props.node_structure, this.props.selectedSource, this.props.selectedRacks, this.props.selectedShelves, id);
                    //console.log('***********************', cart, cart.slot1.i, this.props.service_devices[cart.slot1.i]);
                    delete this.props.service_devices[cart.slot1.i];
                    deleteCartInShelfInServiceDevice(this.props.node_structure, this.props.selectedSource, this.props.selectedRacks,
                        this.props.selectedShelves, id, this.props.service_devices, elem);
                    //find all services that is conected to the cart and remove them from orgonal file
                    //console.log('remove cart is : ', this.props.traffic.main.lightpaths[elem.lightpathId]);

                    //console.log('services are : ', this.props.services);
                    //بیدا کردن تمام سرویس های لایت بس
                    this.props.traffic.main.lightpaths[elem.lightpathId].service_id_list.map((service_of_demands, index) => {
                        //console.log('service_of_demands is :', service_of_demands);
                        if (this.props.services.length > 0 && service_of_demands.type === 'normal') {
                            this.props.services.map((service_of_state, index) => {
                                //console.log('service_of_state is : ', service_of_state);
                                if (service_of_demands.serviceType === service_of_state.type) {
                                    //console.log('*************', service_of_demands.id, service_of_state.services);
                                    service_of_state.services.service_id_list.push(service_of_demands.id);
                                }
                            })
                        } else {
                            //console.log('grooming');
                            let new_id = this.props.groomouts.length + 1;
                            this.props.groomouts.push({
                                id: new_id,
                                name: `groom ${new_id}`,
                                value: service_of_demands.id
                            });
                            // اضافه کردن گروم ها به گروم های دیمندز در فایل ترافیک
                            //  demand = find_demandId_from_source_destination(this.props.demands, this.props.selectedSourceText, this.props.selectedDestinationText);
                            //console.log('demand is : ', demand);
                            let remainGroom = this.props.traffic.main.remaining_groomouts.demands[demand.id];
                            this.props.traffic.main.low_rate_grooming_result.demands[this.props.demand_id].groomouts[service_of_demands.id].lightpath_id = null;
                            remainGroom.push(service_of_demands.id);
                            //console.log('remainGroom is : ', remainGroom);
                        }
                    });

                    //حذف لایت بس از state
                    let new_lightPathes = [];
                    for (let z = 0; z < this.props.lightPathes.length; z++) {
                        if (this.props.lightPathes[z].lightPath === elem.lightpathId) {

                        } else {
                            new_lightPathes.push(this.props.lightPathes[z])
                        }
                    }


                    this.props.basicFillLightPath(new_lightPathes);
                    //بعد حذف کارت تمام سرویس ها در فایل ترافیک باک میشود
                    this.props.traffic.main.lightpaths[elem.lightpathId].service_id_list = [];
                    //پاک کردن لایتپسی که در کارت هست از فایل ترافیک
                    // delete this.props.traffic.main.lightpaths[elem.lightpathId];
                    //اضافه کردن سرویس ها به state
                    this.props.basicFillServices(this.props.services);
                    //console.log('traffic is : ', this.props.traffic);

                } else {
                    alert(`برای حذف کارت از دیمندز ${current_lightPath.source} ${current_lightPath.destination}  استفاده کنید‍‍`)
                }
            } else {
                //cart is MP2X

                let cart_is_this_demand = {};
                let cart = findCart_in_service_device_file(this.props.node_structure, this.props.selectedSource, this.props.selectedRacks, this.props.selectedShelves, id);

                delete this.props.service_devices[cart.slot1.i];
                let groomout_id1 = cart.slot1.groomout_id;
                let connect_to_lightpath = null;
                let groomout_id2 = cart.slot2.groomout_id;
                let connect_to_lightpath2 = null;
                let list_of_services_of_delete = [];
                let newGroom = [];

                // //console.log('groom of cart is : ', elem, groomout_id1, groomout_id2);
                //  پیدا کردن دیمندی که کارت در هست با استفاده گرومینگ ایدی و گرومینگ های کارتی که اماده پاک شدنه در فایل ترافیک
                for (const demands of Object.entries(this.props.traffic.main.low_rate_grooming_result.demands)) {
                    let groomOuts = Object.keys(demands[1].groomouts);

                    if (groomOuts.includes(elem.groomout_id) || groomOuts.includes(groomout_id1) || groomOuts.includes(groomout_id2)) {
                        cart_is_this_demand = demands[1];
                        //console.log('cart_is_this_demand : ', cart_is_this_demand, 'groomout_id1 is : ', groomout_id1, 'groomout_id2 is : ', groomout_id2);
                        if (cart_is_this_demand.source === this.props.selectedSourceText && cart_is_this_demand.destination === this.props.selectedDestinationText) {
                            this.changeCard(this.emptyCard.card, id);
                            deleteCartInShelfInServiceDevice(this.props.node_structure, this.props.selectedSource, this.props.selectedRacks, this.props.selectedShelves, id, this.props.service_devices, elem);
                            //find all services that is connected to the cart and remove them from orginal file
                            if (groomOuts.includes(groomout_id1)) {
                                //پاک کردن گرومهایی که در کارت هست از فایل ترافیک
                                removeFromYourArray(this.props.traffic.main.remaining_groomouts.demands[this.props.demand_id], groomout_id1);
                                //پاک کردن گروم مربوطه از استیت کلی
                                //  this.props.groomouts.filter(row => row.value !== groomout_id1);
                                // //console.log('*******************', this.props.groomouts, groomout_id1,newGroom);
                                list_of_services_of_delete.push(demands[1].groomouts[groomout_id1].service_id_list);
                                connect_to_lightpath = demands[1].groomouts[groomout_id1].lightpath_id;
                                //console.log('connect_to_lightpath is  : ', connect_to_lightpath);
                                if (connect_to_lightpath) {
                                    //console.log('we have connection in line1 and mp1h services are : ', this.props.traffic.main.lightpaths[connect_to_lightpath]);
                                    //console.log('groom that should be remove is: ', groomout_id1);
                                    let current_lightPath = this.props.traffic.main.lightpaths[connect_to_lightpath];
                                    let newService1 = [];
                                    for (let i = 0; i < current_lightPath.service_id_list.length; i++) {
                                        if (current_lightPath.service_id_list[i].id === groomout_id1) {

                                        } else {
                                            newService1.push(current_lightPath.service_id_list[i]);
                                        }
                                    }
                                    this.props.traffic.main.lightpaths[connect_to_lightpath].service_id_list = newService1;
                                } else {
                                    //کارت به جایی اتصال نداره و در صورت داشتن گروم باید حذف شود
                                    //console.log('2 ', this.props.groomouts, groomout_id1);

                                    for (let ii = 0; ii < this.props.groomouts.length; ii++) {
                                        if (this.props.groomouts[ii].value === groomout_id2 || this.props.groomouts[ii].value === groomout_id1) {

                                        } else {
                                            if (newGroom.includes(this.props.groomouts[ii])) {

                                            } else {
                                                newGroom.push(this.props.groomouts[ii])
                                            }
                                        }

                                    }
                                    //console.log('newGroom2 are : ', newGroom);
                                    this.props.basicFillGrooming(newGroom);

                                }
                                demands[1].groomouts[groomout_id1].service_id_list = [];
                                demands[1].groomouts[groomout_id1].lightpath_id = null;

                            }
                            if (groomOuts.includes(groomout_id2)) {
                                //پاک کردن گرومهایی که در کارت هست از فایل ترافیک
                                removeFromYourArray(this.props.traffic.main.remaining_groomouts.demands[this.props.demand_id], groomout_id2);
                                //console.log('services that should be save in file : ', demands[1].groomouts[groomout_id2].service_id_list, 'connection is : ', demands[1].groomouts[groomout_id2].lightpath_id);
                                list_of_services_of_delete.push(demands[1].groomouts[groomout_id2].service_id_list);
                                connect_to_lightpath2 = demands[1].groomouts[groomout_id2].lightpath_id;
                                if (connect_to_lightpath2) {
                                    //console.log('we have connection in line2 and mp1h services are : ', this.props.traffic.main.lightpaths[connect_to_lightpath2]);
                                    //console.log('groom that should be remove is: ', groomout_id2);
                                    let newService2 = [];
                                    let current_lightPath2 = this.props.traffic.main.lightpaths[connect_to_lightpath2];
                                    for (let i = 0; i < current_lightPath2.service_id_list.length; i++) {
                                        if (current_lightPath2.service_id_list[i].id === groomout_id2) {

                                        } else {
                                            newService2.push(current_lightPath2.service_id_list[i]);
                                        }
                                    }
                                    //console.log('************', newService2, 'connect_to_lightpath is ', connect_to_lightpath);
                                    this.props.traffic.main.lightpaths[connect_to_lightpath2].service_id_list = newService2;
                                    //console.log('list of services of connection cart is', this.props.traffic.main.lightpaths[connect_to_lightpath2].service_id_list)

                                } else {
                                    //کارت به جایی اتصال نداره و در صورت داشتن گروم باید حذف شود
                                    //console.log('2 ', this.props.groomouts, groomout_id2);

                                    for (let ii = 0; ii < this.props.groomouts.length; ii++) {
                                        if (this.props.groomouts[ii].value === groomout_id2 || this.props.groomouts[ii].value === groomout_id1) {

                                        } else {
                                            if (newGroom.includes(this.props.groomouts[ii])) {

                                            } else {
                                                newGroom.push(this.props.groomouts[ii])
                                            }
                                        }

                                    }
                                    //console.log('newGroom2 are : ', newGroom);
                                    this.props.basicFillGrooming(newGroom);

                                }
                                demands[1].groomouts[groomout_id2].service_id_list = [];
                                demands[1].groomouts[groomout_id2].lightpath_id = null
                            }
                            //save services in state and traffic file in groom(low_rate_grooming_result)
                            //console.log('state', this.props.services);
                            this.props.services.map((service_of_state, index) => {
                                //console.log('service_of_state is : ', service_of_state, 'service that be save in sate : ', list_of_services_of_delete);
                                for (let i = 0; i < list_of_services_of_delete.length; i++) {
                                    for (let j = 0; j < list_of_services_of_delete[i].length; j++) {
                                        if (list_of_services_of_delete[i][j].type === service_of_state.type) {
                                            //console.log('*************', list_of_services_of_delete[i][j], service_of_state.services);
                                            service_of_state.services.service_id_list.push(list_of_services_of_delete[i][j].id);
                                        }
                                    }
                                }
                            });
                            this.props.basicFillServices(this.props.services);
                            this.props.basicRefresh();
                        } else {
                            alert(`برای حذف کارت از دیمندز ${cart_is_this_demand.source} ${cart_is_this_demand.destination}  استفاده کنید‍‍`)
                        }
                    }
                }

            }
        } else {
            alert('لطفا مقصد را مشخص کنید');
        }

    }

    calcPowerConsumption() {
        if (this.isEmpty()) return 0;
        let sum = 100;
        this.state.cardArr.forEach(item => sum += item.card.power);
        return sum;
    }

    handleEscEvent = (ev) => {
        if (ev.keyCode === 27) {
            this.props.setSelectedCard(0, this.emptyCard.card);
        }
    };

    deleteService_from_port = (cartNum, dragPort, serviceId, deleteService, card, port, groomout_id) => {
        // لطفا قبل از حذف سرویس مقصد را انتخاب کنید...

        let isThereLightPath = {};
        let isThereGroomout = {};
        if (card.textLabel === 'MP1H' || card.textLabel === 'TP1H') {
            //console.log('card is MP1H: ', card, card.lightpathId, card.textLabel);
            isThereLightPath = checkLightPathIsThereInTraffic(this.props.traffic,
                card.lightpathId, this.props.selectedSourceText, this.props.selectedDestinationText);
            //console.log('isThereLightPath', isThereLightPath.source, isThereLightPath.destination, this.props.selectedSourceText, this.props.selectedDestinationText);
            if (isThereLightPath.source === this.props.selectedSourceText && isThereLightPath.destination === this.props.selectedDestinationText) {
                if (this.props.selectedDestinationText) {
                    if (this.props.services) {
                        //console.log('***************', this.props.services);
                        //انتخاب سرویس مورد نظر از لیست سرویس های دیمند انتخابی که در استیت داریم
                        let currentServiceList = this.props.services.filter(service => service.type == deleteService ? deleteService.serviceType : "");
                        // سفید کردن پورت مورد نظر
                        let changeCardArr = this.state.cardArr.map((cart, index) => {
                            if (cart.id == cartNum) {
                                let ports = cart.card.ports.map((port, PortIndex) => {
                                    if (port.id == dragPort) {
                                        port.connected = this.props.cardEnums.notConnected;
                                        return port;
                                    } else {
                                        return port
                                    }
                                });
                                cart.card.ports = ports;
                                return cart;
                            } else {
                                return cart
                            }

                        });
                        this.setState({ cardArr: changeCardArr });

                        // اضافه کردن سرویس ها به لیست سرویس ها در ترافیک فایل
                        if (deleteService.type === 'groomout') {
                            this.props.addServices_of_demands('addService', deleteService.type, card, port, groomout_id);
                        } else {
                            this.props.addServices_of_demands('addService', deleteService.serviceType, card, port, groomout_id);
                        }

                    }
                } else {
                    alert('لطفا قبل از حذف سرویس مقصد را انتخاب کنید...');
                }
            } else {
                alert(`شما در این نسخه اجازه ی حذف سرویس از دیمندز دیگر ندارید...برای حذف این سرویس از دیمندز  ${isThereLightPath.source}${isThereLightPath.destination} استفاده کنید..`)
            }

        } else {
            //console.log('card is MP2X or others : ', card, card.lightpathId, card.textLabel, groomout_id, deleteService);
            isThereGroomout = checkGroomoutIsThereInTraffic(this.props.traffic,
                groomout_id, this.props.selectedSourceText, this.props.selectedDestinationText);
            //console.log(isThereGroomout);
            if (isThereGroomout.source === this.props.selectedSourceText && isThereGroomout.destination === this.props.selectedDestinationText) {
                if (this.props.selectedDestinationText) {
                    if (this.props.services) {
                        //console.log('***************', this.props.services);
                        //انتخاب سرویس مورد نظر از لیست سرویس های دیمند
                        let currentServiceList = this.props.services.filter(service => service.type == deleteService ? deleteService.serviceType : "");
                        //رنگی کردن پورت مورد نظر
                        let changeCardArr = this.state.cardArr.map((cart, index) => {
                            if (cart.id == cartNum) {
                                let ports = cart.card.ports.map((port, PortIndex) => {
                                    if (port.id == dragPort) {
                                        port.connected = this.props.cardEnums.notConnected;
                                        return port;
                                    } else {
                                        return port
                                    }
                                });
                                cart.card.ports = ports;
                                return cart;
                            } else {
                                return cart
                            }

                        });
                        this.setState({ cardArr: changeCardArr });
                        //اضافه کردن سرویس ها به لیست سرویس ها
                        if (deleteService.type === 'groomout') {
                            this.props.addServices_of_demands('addService', deleteService.type, card, port, groomout_id);
                        } else {
                            this.props.addServices_of_demands('addService', deleteService.serviceType, card, port, groomout_id);
                        }


                    }
                } else {
                    alert('لطفا قبل از حذف سرویس مقصد را انتخاب کنید...');
                }
            } else {
                alert(`شما در این نسخه اجازه ی حذف سرویس از دیمندز دیگر ندارید...برای حذف این سرویس از دیمندز  ${isThereGroomout.source}${isThereGroomout.destination} استفاده کنید..`)
            }
        }
        //console.log(this.state, this.props);
    };

    dragService_to_port = (cartNum, dragPort, serviceId, card, groomout_id) => {

        //console.log('dragService_to_port', this.state.cardArr, card, cartNum, dragPort, serviceId, groomout_id, this.props.serviceOrGroom);
        //با توجه به سرویس بودن یا گروم بودن تصمیم میگیریم و اگر سرویس بود یا گروم بر اساس نوع کارت عملیات زیر انجام میشود
        if (this.props.serviceOrGroom === 'service') {
            //console.log('cart is MP1H');
            if (this.props.services || this.props.groomouts) {
                //انتخاب سرویس مورد نظر از استیت 
                let currentServiceList = this.props.services.filter(service => service.id == serviceId);
                //console.log('currentServiceList is : ', currentServiceList);
                let type_of_service = currentServiceList[0].type;
                //اگه تعداد سرویس مورد نظر صفر نباشه
                if (currentServiceList[0]) {
                    if (currentServiceList[0].services.service_id_list.length > 0) {
                        let use_lightPathes_in_Demands = this.props.traffic.main.lightpaths;
                        let use_grooming_in_Demands = this.props.traffic.main.low_rate_grooming_result.demands;
                        // به شرط اینکه سرویسی که روی کارت کشیده میشود لایت بسش مربوط به همون دیمندز باشد بس این سرویس کم میشود
                        if (card.lightpathId) {
                            //cart is MP1H
                            //چک کردن محدودیت سرویس برای کارت های MP1H
                            if (type_of_service && (card.textLabel === 'MP1H' && (type_of_service === '10GE' || type_of_service === 'STM64') || card.textLabel === 'TP1H' && (type_of_service === '100GE'))) {
                                if (use_lightPathes_in_Demands[card.lightpathId]) {
                                    if (use_lightPathes_in_Demands[card.lightpathId].source === this.props.selectedSourceText &&
                                        use_lightPathes_in_Demands[card.lightpathId].destination === this.props.selectedDestinationText ||
                                        use_lightPathes_in_Demands[card.lightpathId].source === this.props.selectedDestinationText &&
                                        use_lightPathes_in_Demands[card.lightpathId].destination === this.props.selectedSourceText) {
                                        //  رنگی کردن پورت مورد نظر و ساختن دوباره کارت مورد نظر...
                                        for (let i = 0; i < this.state.cardArr.length; i++) {
                                            if (this.state.cardArr[i].id == cartNum) {
                                                for (let j = 0; j < this.state.cardArr[i].card.ports.length; j++) {
                                                    if (this.state.cardArr[i].card.ports[j].id == dragPort) {
                                                        //console.log('***********************************port connect**********************************')
                                                        this.state.cardArr[i].card.ports[j].connected = 'connected';
                                                    }
                                                }
                                            }
                                        }
                                        //demands کم کردن سرویس ها از لیست  کل سرویس ها
                                        this.props.deleteServices_of_demands('deleteService', serviceId, card, currentServiceList, 'haveLightPath', 'norandom');
                                    } else {
                                        alert(`service of demands is not for selective demands so use this demands** :  ${use_lightPathes_in_Demands[card.lightpathId].source} ${use_lightPathes_in_Demands[card.lightpathId].destination}`)

                                    }
                                }
                            } else {
                                //console.log(card.textLabel)
                                if (card.textLabel === 'MP1H') {
                                    alert('در کارتهای MP1H شما تنها اجازه ی استفاده از سرویس های  زیر را دارید 10G , SMT64')
                                }
                                if (card.textLabel === 'TP1H') {
                                    alert('در کارتهای TP1H شما تنها اجازه ی استفاده از سرویس های  زیر را دارید 100G ')
                                }

                            }
                        } else {
                            //چک کردن محدودیت سرویس برای کارت های MP1H
                            if (type_of_service && (type_of_service === 'GE' || type_of_service === 'STM16' || type_of_service === 'STM4' || type_of_service === 'STM1' || type_of_service === 'FE')) {
                                //کم کردن سرویس از گروم های فایل ترافیک
                                for (const demand_of_mp2x of Object.entries(use_grooming_in_Demands)) {
                                    let groomouts = demand_of_mp2x[1].groomouts;
                                    if (groomouts[groomout_id]) {
                                        console.log(groomouts, groomout_id, groomouts[groomout_id].source, this.props.selectedSourceText,
                                            groomouts[groomout_id].destination, this.props.selectedDestinationText);
                                        if (groomouts[groomout_id].source === this.props.selectedSourceText &&
                                            groomouts[groomout_id].destination === this.props.selectedDestinationText ||
                                            groomouts[groomout_id].source === this.props.selectedDestinationText &&
                                            groomouts[groomout_id].destination === this.props.selectedSourceText) {
                                            //  رنگی کردن پورت مورد نظر و ساختن دوباره کارت مورد نظر...
                                            for (let i = 0; i < this.state.cardArr.length; i++) {
                                                if (this.state.cardArr[i].id == cartNum) {
                                                    for (let j = 0; j < this.state.cardArr[i].card.ports.length; j++) {
                                                        if (this.state.cardArr[i].card.ports[j].id == dragPort) {
                                                            this.state.cardArr[i].card.ports[j].connected = 'connected';
                                                        }
                                                    }
                                                }
                                            }
                                            //demands کم کردن سرویس ها از لیست  کل سرویس ها
                                            this.props.deleteServices_of_demands('deleteService', serviceId, card, currentServiceList, 'haveLightPath', 'norandom', groomout_id);
                                            break;
                                        } else {
                                            alert(`service of demands is not for selective demands use* ${groomouts[groomout_id].source} ${groomouts[groomout_id].destination}`)
                                        }
                                    }
                                }
                            } else {
                                alert('در کارتهای MP2X شما تنها اجازه ی استفاده از سرویس های  زیر را دارید : 1GE , STM16 , STM4 , STM1,FE')
                            }
                        }
                    } else {
                        alert('list of current service is empty');
                    }
                }
            }
        } else {
            //console.log('cart is MP2X')
            //serviceOrGroom is groom
            if (card.textLabel === 'MP2X') {
                alert('شما اجازه استفاده از ابجکت گروم در کارت های MP2X را ندارید')
            } else {
                //every cart and no MP2X
                //انتخاب گروم مورد نظر از لیست گروم های دیمند
                //console.log('this.props.groomouts is : ', this.props.groomouts);

                let lightpaths = this.props.traffic.main.lightpaths;
                let remaining_groomouts = this.props.traffic.main.remaining_groomouts;
                // به شرط اینکه سرویسی که روی کارت کشیده میشود لایت بسش مربوط به همون دیمندز باشد بس این سرویس کم میشود
                if (card.lightpathId) {
                    //cart is MP1H
                    if (lightpaths[card.lightpathId]) {
                        if (lightpaths[card.lightpathId].source === this.props.selectedSourceText &&
                            lightpaths[card.lightpathId].destination === this.props.selectedDestinationText) {
                            //console.log('this.groom is for this dimands.....');
                            //  رنگی کردن پورت مورد نظر و ساختن دوباره کارت مورد نظر...
                            for (let i = 0; i < this.state.cardArr.length; i++) {
                                if (this.state.cardArr[i].id == cartNum) {
                                    for (let j = 0; j < this.state.cardArr[i].card.ports.length; j++) {
                                        if (this.state.cardArr[i].card.ports[j].id == dragPort) {
                                            //console.log('*******************cart connected************************')
                                            this.state.cardArr[i].card.ports[j].connected = 'connected';
                                        }
                                    }
                                }
                            }
                            //demands کم کردن سرویس ها از لیست  کل سرویس ها
                            this.props.deleteGroomout_of_demands('deleteService', serviceId, card, this.props.groomouts[0], 'haveLightPath', 'norandom');
                        } else {
                            alert(`service of demands is not for selective demands so use this demands :  ${lightpaths[card.lightpathId].source} ${lightpaths[card.lightpathId].destination}`)
                        }
                    }
                }


            }

        }
        //console.log(this.state, this.props);

    };

    render() {

        // //console.log("this.props.cardArr",this.props.cardArr);
        //console.log(' %c render shelf! ', 'background: #222; color: #bada55', 'props', this.props.cardArr, 'state', this.state.cardArr, '##3');

        const visibility = (this.calcPowerConsumption() > 0 || this.props.RackPower > 0) ? "visible" : "invisible";

        return (
            <>
                <table style={{ margin: "auto", width: 'unset', marginTop: "4rem" }}>
                    <tbody>
                        <tr>
                            <td key={'tdBody'}>

                                {
                                    this.state.cardArr.map(elem =>
                                        <div
                                            key={elem.id}
                                            className={"float-right"}
                                            onDragOver={this.allowDrop}
                                            onDrop={
                                                (ev) =>
                                                    this.drop(ev, this.props.cardStorage, elem.id, 'drop', elem)
                                            }
                                            onContextMenu={(ev) => this.conMen(ev, elem.id, elem)}
                                            onClick={(ev) => this.handleOnCardLeftClick(ev, elem.id)}
                                        >
                                            <CartDragable
                                                dragService_to_port={this.dragService_to_port}
                                                selectedCurrentService={this.props.selectedCurrentService}
                                                num={elem.id}
                                                card={elem.card}
                                                selected={elem.id === this.props.selected}
                                                enums={this.props.cardEnums}
                                                setPrevClick={this.setPrevLeftClick}
                                                onPortClick={portId => this.props.onCardPortClick(elem.id, portId)}
                                            />
                                        </div>
                                    )
                                }
                            </td>
                        </tr>
                        <tr>

                            <td key={'td_of_table'}>
                                {
                                    this.state.cardArr.map(elem =>
                                        <div
                                            key={elem.id}
                                            className={"float-right"}
                                            onDragOver={this.allowDrop}
                                            // onDrop={
                                            //     (ev) =>
                                            //         this.drop(ev, this.props.cardStorage, elem.id, 'drop')
                                            // }
                                            onContextMenu={(ev) => this.conMen(ev, elem.id, elem)}
                                            onClick={(ev) => this.handleOnCardLeftClick(ev, elem.id)}
                                        >
                                            
                                            <Card
                                                service_devices = {this.props.service_devices}
                                                CardItems = {this.props.cardArr}
                                                traffic={this.props.traffic}
                                                dragService_to_port={this.dragService_to_port}
                                                deleteService_from_port={this.deleteService_from_port}
                                                selectedCurrentService={this.props.selectedCurrentService}
                                                num={elem.id}
                                                card={elem.card}
                                                groomout_id={elem.groomout_id ? elem.groomout_id : ''}
                                                selected={elem.id === this.props.selected}
                                                enums={this.props.cardEnums}
                                                setPrevClick={this.setPrevLeftClick}
                                                onPortClick={portId => this.props.onCardPortClick(elem.id, portId)}
                                                selectedSourceText={this.props.selectedSourceText}
                                                selectedDestinationText={this.props.selectedDestinationText}
                                                elem={elem}
                                                lightpath_cap={this.props.lightpath_cap}
                                                groomouts_cap={this.props.groomouts_cap}
                                            />
                                        </div>
                                    )
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p className="border-2px margin--top--2"
                                    style={this.props.selected !== 0 ? { transform: "translate(9.5px);" } : { transform: "translate(9.5px)" }}>FAN/HB</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ visibility: this.state.saveState ? "visible" : "hidden" }}>
                                <button type="button" className="btn btn-outline-primary m-2 btn-sm"
                                    onClick={() => this.onSave(this.state)}>save
                                </button>
                                {/* <button type="button" className="btn btn-outline-danger m-2 btn-sm"
                                    onClick={() => this.onCancel(this.props)}>Cancel
                            </button> */}
                            </td>
                        </tr>
                    </tbody>
                </table>

            </>
        );
    }
    ;
}

export default Shelf;