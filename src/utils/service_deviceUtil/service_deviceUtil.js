import config from "../../config";
import { getServiceDeviceCartWithDeviceId } from "../util";

var randomize = require('randomatic');

export function service_deviceServerCheck(service_devicesFromProps) {
    let demands = null;
    if (config.server) {
        demands = service_devicesFromProps;
    } else {
        demands = config.service_devices;
    }
    return demands
}

export function addShelfInServiceDevice(service_devices, selectedSource, selectedRack, node_structure) {
    //console.log('drop cart', service_devices, selectedSource, selectedRack);
    let newServiceDevice = null;
    if (node_structure) {
        if (node_structure.nodes[selectedSource]) {
            let currentShelf = node_structure.nodes[selectedSource].racks[selectedRack - 1];
            //console.log('addShelfInServiceDevice', currentShelf, Object.keys(currentShelf.shelves).length);
            currentShelf.shelves[Object.keys(currentShelf.shelves).length] = {
                slots: createBasicShelf('object'),
                flagChange: 'true'
            }
        }
    }
    //console.log()
    return newServiceDevice
}


export function createBasicShelf(type) {

    if (type === 'array') {

        let newSlots = [];
        for (let i = 0; i < 14; i++) {
            newSlots.push(standardParamForCart(i));
        }
        return newSlots

    } else {
        let newSlots = {}
        for (let i = 0; i < 14; i++) {
            newSlots[i] = standardParamForCart(i);
        }
        return newSlots
    }


}

function standardFillParamForCart() {
    let objFill = {};
    objFill['type'] = 'pattern';
    objFill['pattern'] = "solid";
    objFill['fgColor'] = { argb: '00F2DCDB' };
    return objFill;
}

function standardParamForCart(i) {
    let slotObj = {}
    slotObj['fill'] = standardFillParamForCart()
    slotObj['lightpathId'] = "";
    slotObj['id'] = i;
    slotObj['name'] = "";
    slotObj['panel'] = "";
    slotObj['place'] = i;
    slotObj['services'] = [];
    slotObj['serviceWithType'] = [];
    slotObj['size'] = 1;
    return slotObj
}

export function addCartInShelfInServiceDevice(node_structure, selectedSource, selectedRack, selectedShelf,
    selectPlace, cartName, service_devices, newRandomForServiceDevice, selectedDes, traffic, demands) {
    // //console.log('*****drop cart', node_structure, selectedSource, selectedRack, selectedShelf, 'selectPlace is : ', selectPlace);
    //console.log('################### addCartInShelfInServiceDevice ##################')
    let newServiceDevice = null;
    if (node_structure) {
        if (node_structure.nodes[selectedSource]) {
            // زمانی که کارتی به سیستم اضاف میشود باید برای اون کارت یک لایت بس یا گرو اوت ساخته شود ودر فایل های 
            // nodeStructure و servicedevice اضافه شود
            //TODO: باید سایز کارت هم باس داده شود تا محاسبه شود چندا اسلات باید ساخته شود فعلا با فرض ساز ۲ بیش میریم
            let currentShelf = node_structure.nodes[selectedSource].racks[selectedRack - 1];
            if (currentShelf) {

                if (cartName === 'MP1H' || cartName === 'MP2D') {
                    //console.log('MP1H');
                    let newRandom = randomize('a0', 32);
                    //console.log('******', cartName, newRandom, node_structure.nodes[selectedSource].racks, selectedRack, currentShelf.shelves, selectedShelf);
                    //در ساختار شماره ۲ و مبینگ شده ی  فایل نود استراکچر ما باید بارامترهای زیر و بر کنیم
                    let slot = currentShelf.shelves[selectedShelf - 1].slots[selectPlace];
                    let sideSlot = currentShelf.shelves[selectedShelf - 1].slots[selectPlace + 1];
                    slot.name = cartName;
                    slot.panel = cartName;
                    slot.size = 2;
                    slot.i = newRandom;
                    slot.lightpathId = newRandomForServiceDevice;
                    slot.groomout_id = "";
                    sideSlot.lightpathId = newRandomForServiceDevice;
                    sideSlot.groomout_id = "";
                    sideSlot.i = newRandom;
                    sideSlot.name = cartName;
                    sideSlot.panel = cartName;
                    sideSlot.size = 2;

                    service_devices[newRandom] = {
                        sub_tm_id: "main",
                        lightpath_id: newRandomForServiceDevice,
                        id: newRandom,
                        panel: cartName
                    };

                    //ترافیک هم باید تعریف بشه
                    //console.log(traffic);
                    traffic.main.lightpaths[newRandomForServiceDevice] = {
                        id: newRandomForServiceDevice,
                        source: selectedSource,
                        destination: selectedDes,
                        service_id_list: [],
                        routing_type: "100GE",
                        demand_id: demands,
                        protection_type: "1+1_NodeDisjoint",
                        restoration_type: "JointSame",
                        capacity: 31.25
                    };
                    return { groom1: '', groom2: '', lightPath: newRandomForServiceDevice }
                } else {
                    if (cartName === 'MP2X') {
                        //console.log('MP2X');
                        let newRandom = randomize('a0', 32);
                        let newRandomForServiceDevice_groom1 = randomize('a0', 32);
                        let newRandomForServiceDevice_groom2 = randomize('a0', 32);
                        //console.log('******', cartName, newRandom, node_structure.nodes[selectedSource].racks, selectedRack, currentShelf.shelves, selectedShelf);
                        //در ساختار شماره ۲ و مبینگ شده ی  فایل نود استراکچر ما باید بارامترهای زیر و بر کنیم
                        let slot = currentShelf.shelves[selectedShelf - 1].slots[selectPlace];
                        let sideSlot = currentShelf.shelves[selectedShelf - 1].slots[selectPlace + 1];
                        slot.name = cartName;
                        slot.panel = cartName;
                        slot.size = 2;
                        slot.i = newRandom;
                        slot.lightpathId = "";
                        slot.groomout_id = newRandomForServiceDevice_groom1;
                        sideSlot.lightpathId = "";
                        sideSlot.groomout_id = newRandomForServiceDevice_groom2;
                        sideSlot.i = newRandom;
                        sideSlot.name = cartName;
                        sideSlot.panel = cartName;
                        sideSlot.size = 2;

                        service_devices[newRandom] = {

                            sub_tm_id: "main",
                            line1: {
                                groomout_id: newRandomForServiceDevice_groom1,
                                demand_id: demands
                            },
                            line2: {
                                groomout_id: newRandomForServiceDevice_groom2,
                                demand_id: demands
                            },
                            id: newRandom,
                            panel: cartName,

                        };
                        //add new groom to traffic file ==>add two groom
                        //ترافیک هم باید تعریف بشه
                        //console.log(newRandomForServiceDevice_groom1, newRandomForServiceDevice_groom2)
                        //console.log('****', traffic.main.low_rate_grooming_result.demands[demands], demands, traffic.main.low_rate_grooming_result.demands)
                        traffic.main.low_rate_grooming_result.demands[demands].groomouts[newRandomForServiceDevice_groom1] = {
                            quantity: 1,
                            service_id_list: [],
                            id: newRandomForServiceDevice_groom1,
                            sla: "None",
                            type: cartName,
                            capacity: 7.5,
                            lightpath_id: null
                        };
                        traffic.main.low_rate_grooming_result.demands[demands].groomouts[newRandomForServiceDevice_groom2] = {
                            quantity: 1,
                            service_id_list: [],
                            id: newRandomForServiceDevice_groom2,
                            sla: "None",
                            type: cartName,
                            capacity: 7.5,
                            lightpath_id: null
                        };
                        //add new groom to traffic file in remain groom ==>add two groom
                        traffic.main.remaining_groomouts.demands[demands].push(newRandomForServiceDevice_groom1)
                        traffic.main.remaining_groomouts.demands[demands].push(newRandomForServiceDevice_groom2)
                        return { groom1: newRandomForServiceDevice_groom1, groom2: newRandomForServiceDevice_groom2, lightPath: '' }
                    }
                }


                //console.log('traffic in drag cart is : ', traffic.main.lightpaths[newRandomForServiceDevice]);
                //console.log('currentShelf is :', currentShelf, node_structure, service_devices)
            }
        }
    }
    return newServiceDevice
}

export function deleteCartInShelfInServiceDevice(node_structure, selectedSource, selectedRack, selectedShelf, selectPlace, service_devices, elem) {

    let cart = {};
    if (node_structure) {
        if (node_structure.nodes[selectedSource]) {
            let currentShelf = node_structure.nodes[selectedSource].racks[selectedRack - 1];

            if (currentShelf) {

                let slot = currentShelf.shelves[selectedShelf - 1].slots[selectPlace];
                let sideSlot = currentShelf.shelves[selectedShelf - 1].slots[selectPlace + 1];
                cart['slot1'] = slot;
                cart['slot2'] = sideSlot;
                // //console.log('slots of cart are: ', slot, sideSlot);
                if (slot) {
                    slot.lightpathId = "";
                    slot.groomout_id = "";
                    slot.name = "";
                    slot.panel = "";
                    slot.size = 1;
                    slot.i = "";
                }
                if (sideSlot) {
                    sideSlot.lightpathId = "";
                    sideSlot.groomout_id = "";
                    sideSlot.name = "";
                    sideSlot.panel = "";
                    sideSlot.size = 1;
                    sideSlot.i = ""
                }
            }


        }

    }
    return cart
}

export function findCart_in_service_device_file(node_structure, selectedSource, selectedRack, selectedShelf, selectPlace) {


    let cart = {};
    if (node_structure) {
        if (node_structure.nodes[selectedSource]) {
            let currentShelf = node_structure.nodes[selectedSource].racks[selectedRack - 1];
            if (currentShelf) {
                let slot = currentShelf.shelves[selectedShelf - 1].slots[selectPlace];
                let sideSlot = currentShelf.shelves[selectedShelf - 1].slots[selectPlace + 1];

                cart['slot1'] = slot;
                cart['slot2'] = sideSlot;

            }
            //console.log('cart is here : ', selectedSource, selectedRack, currentShelf, selectedShelf, cart)
        }

    }

    return cart
}
