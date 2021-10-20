import CardData from "../components/Template/components/CardData";
import {createBasicShelf} from "./service_deviceUtil/service_deviceUtil";

export function selectedShelvesFunc(shelves, selected) {
    let currentShelves = {};
    for (let i = 0; i < shelves.length; i++) {
        if (shelves[i].id == selected) {
            if (Array.isArray(shelves[i].children)) {
                currentShelves = shelves[i]
            } else {
                shelves[i]['children'] = [{
                    type: 'MP2X',
                }]
            }
        }
    }
    return currentShelves;

}

export function specialCarts(currentShelves, type) {
    // //console.log('555555555555555', type, currentShelves)
    let newCarts = [];
    // //console.log('carts in special carts function is : ', newCarts, currentShelves)
    if (currentShelves.children) {
        let length_of_carts = currentShelves.children.length;
        if (currentShelves.children.length > 0) {
            for (let i = 0; i < 7; i++) {
                let flag = false;
                // //console.log('i am in home ', i);
                for (let k = 0; k < length_of_carts; k++) {

                    // //console.log('i am in shelve : ', currentShelves.id, 'home : ', k, 'value is: ', currentShelves.children[k].place)
                    if (currentShelves.children[k].place === i) {
                        flag = false;
                        if (currentShelves.children[k].type === 'MP2X') {
                            newCarts.push('MP2X');
                        } else if (currentShelves.children[k].type === 'MP2D') {
                            newCarts.push('MP2D');
                        } else if (currentShelves.children[k].type === 'MP1H') {
                            newCarts.push('MP1H');
                        }
                        // else if (currentShelves.children[k].type === 'TP1H') {
                        //     newCarts.push('TP1H');
                        // }
                        else {
                            newCarts.push('default');
                        }
                        break;
                    } else {
                        flag = true
                    }
                }
                if (flag) {
                    newCarts.push('default');
                }
            }
        } else {

        }
    } else {
    }
    //console.log('carts in special carts function is : ', newCarts);
    return newCarts;

}

export function destinations_of_selectedSource(demands, selectedSource) {
    let destination = [];
    if (demands) {
        for (const item of Object.entries(demands)) {
            //به ازای هر سورس در فایل کانفیگ(دیمندز) اگر برابر با سورس انتخابی باشد مقصدارو از فایل دیمندز بکش بیرون
            if (item[1].source === selectedSource) {
                destination.push(item[1].destination)
            }
        }
    }
    return destination;
}

export function standardDestination(destination) {
    let newDestination = [];
    for (let i = 0; i < destination.length; i++) {
        let obj = {};
        obj['id'] = i + 1;
        obj['name'] = destination[i];
        newDestination.push(obj)
    }
    return newDestination;
}

export function standardRacks(racks) {

    let newRack = [];
    for (const everyRack of Object.entries(racks)) {
        // //console.log('************** every Rack ***************', everyRack)
        let objRack = {};
        //همون کلیدی که در فایل هست ب اضافه یک میکنیم چون ما در LOV
        //مقدار تعریف شده صفر را داریم
        // result : ما همیشه برای لیست دروپ دونی از یک شمارش داریم
        let counterRack = parseInt(everyRack[0]) + 1;
        objRack['id'] = counterRack;
        objRack['name'] = 'rack' + counterRack;
        newRack.push(objRack)
    }
    return newRack;
}

export function filtersLightPathesWith_Source(listLightPathes, selectedSource) {
    let filtersLightPathes = [];
    if (selectedSource) {
        for (const lightPath of Object.entries(listLightPathes)) {
            // //console.log(lightPath[1].source, selectedSource, lightPath[1].destination, selectedDestination);
            if (lightPath[1].source === selectedSource || lightPath[1].destination === selectedSource) {
                filtersLightPathes.push(lightPath[1]);
            }
        }
    }
    // //console.log('filtersLightPathesWith_Source', filtersLightPathes)
    return filtersLightPathes;
}

export function filtersGroomOutWith_Source(groomOutAll, selectedSource) {
    let filtersGroomOut = [];
    if (selectedSource) {
        for (const groomOut of Object.entries(groomOutAll.demands)) {
            // //console.log(groomOut[1].source, selectedSource, groomOut[1].destination, selectedDestination);
            if (groomOut[1].source === selectedSource || groomOut[1].destination === selectedSource) {
                filtersGroomOut.push(groomOut[1]);
            }
        }
    }
    // //console.log('filtersLightPathesWith_Source', filtersLightPathes)
    return filtersGroomOut;
}

export function filtersLightPathesWith_Source_dest(listLightPathes, selectedSource, des) {
    let filtersLightPathes = [];
    if (selectedSource) {
        for (const lightPath of Object.entries(listLightPathes)) {
            // //console.log(lightPath[1].source, selectedSource, lightPath[1].destination, selectedDestination);
            if (lightPath[1].source === selectedSource && lightPath[1].destination === des) {
                filtersLightPathes.push(lightPath[1]);
            }
        }
    }
    return filtersLightPathes;
}

export function allLightPathsWithServices_of_source(selectedSource, traffic) {

    let use_lightPathes_in_Demands = traffic.main.lightpaths;

    return filtersLightPathesWith_Source(use_lightPathes_in_Demands, selectedSource);

}

export function allGroomOutWithServices_of_source(selectedSource, traffic) {


    let low_rate_grooming_result = traffic.main.low_rate_grooming_result;
    return filtersGroomOutWith_Source(low_rate_grooming_result, selectedSource);

}

export function allLightPathsWithServices_of_source_dest(selectedSource, traffic, dest) {

    let use_lightPathes_in_Demands = traffic.main.lightpaths;
    return filtersLightPathesWith_Source_dest(use_lightPathes_in_Demands, selectedSource, dest);

}

export function remove_service_from_trafficFile(selectedSource, traffic, dest, card) {

    let use_lightPathes_in_Demands = traffic.main.lightpaths;
    let filterLightPathes = filtersLightPathesWith_Source(use_lightPathes_in_Demands, selectedSource, dest);
    //console.log('filtersLightPathesWith_Source', filterLightPathes, card);

    return filterLightPathes;

}


export function getServiceDeviceCartWithDeviceId(serviceDevices, deviceId) {
    // //console.log('serviceDevices',serviceDevices)
    return serviceDevices[deviceId];
}

export function lightPathes_of_shelve_of_rack_of_source(selectedSource, rack, shelve, service_device, node_structure) {
    //********************* ساختن شلف ها ** ********************
    //TODO:before Change
    // if (service_device.nodes[selectedSource]) {
    //TODO:after change
    if (node_structure.nodes[selectedSource]) {
        //تعداد کل رک ها
        let racks = node_structure.nodes[selectedSource].racks;
        //console.log('racks are : ', racks);
        let newRack = [];
        let selectedRack = racks[rack - 1];
        if (selectedRack) {
            //console.log('rack is : ', selectedRack);
            let shelves = selectedRack['shelves'];
            //console.log('shelves are : ', shelves);
            let count_of_shelves_racks_of_node = Object.keys(shelves).length;
            //console.log('count_of_shelves_racks_of_node is : ', count_of_shelves_racks_of_node);
            let lightPathes = [];
            let selectedShelves;
            for (const item of Object.entries(shelves)) {
                //console.log(' ********** every shelve is *********: ', item);
                if (item[0] == shelve - 1) {
                    selectedShelves = item[1]
                }
            }
            let cards = [];
            let children = [];
            //console.log(' ********** every shelve is *********: ', selectedShelves);
            let counter = 0;
            let place = 0;
            let groomout_id = [];
            let lightpath_id = [];

            if (selectedShelves) {
                for (const slots of Object.entries(selectedShelves.slots)) {


                    let currentDevice = slots[1];
                    let currentCart = getServiceDeviceCartWithDeviceId(service_device, currentDevice)
                    if (currentDevice) {
                        //TODO:lightpath_id اینو فقط تغییر بده currentCart.lightpath_id
                        if (currentDevice.name === 'MP1H' || currentDevice.name === 'TP1H') {
                            lightPathes.push({lightpath_id: currentDevice.lightpathId, panel: currentDevice.name});
                        } else {
                            lightPathes.push({
                                groomout_id: currentDevice.groomout_id,
                                panel: currentDevice.name,
                                lightpath_id: currentDevice.lightpathId,
                                // line1: currentDevice.line1,
                                // line2: currentDevice.line2,

                            });
                        }
                        // //console.log()
                        counter = counter + 1;
                        let objOfChildren = {};
                        //console.log(counter, 'every slots are : ', slots[1]);
                        // if (Object.keys(slots[1]).includes('lightpath_id')) {
                        //     if (lightpath_id.includes(slots[1].lightpath_id)) {
                        //
                        //     } else {
                        //         //لیست lightPathes
                        //         lightPathes.push(slots[1].lightpath_id);
                        //         //**********************************
                        //         lightpath_id.push(slots[1].lightpath_id);
                        //         cards.push(slots[1].panel);
                        //         objOfChildren['type'] = slots[1].panel;
                        //         objOfChildren['place'] = place;
                        //         place = place + 1;
                        //         children.push(objOfChildren);
                        //         // {type: "MP2X", place: 1}
                        //     }
                        //
                        // }
                        // if (Object.keys(slots[1]).includes('line1')) {
                        //     if (groomout_id.includes(slots[1].line1.groomout_id)) {
                        //
                        //     } else {
                        //         groomout_id.push(slots[1].line1.groomout_id);
                        //         cards.push(slots[1].panel);
                        //         objOfChildren['type'] = slots[1].panel;
                        //         objOfChildren['place'] = place;
                        //         place = place + 1;
                        //         children.push(objOfChildren);
                        //     }
                        // }
                    }


                }
                return lightPathes;
            } else {
                return [];
            }
        } else {
            return [];
        }


    }
}

//selectedSourceText,rack_of_lov,shelve_of_lov
export function filter_useLightPath_from_allLightPath_in_source(selectedSource, rack, shelve, demonds, traffic, service_device, node_structure) {
    //console.log('input of filter_useLightPath_from_allLightPath_in_source function : ', selectedSource, rack, shelve);
    let useLightPath_shelves = [];
    //لایت بس های مربوط به یک شلف
    let lightPathes_of_shelve = lightPathes_of_shelve_of_rack_of_source(selectedSource, rack, shelve, service_device, node_structure);
    //console.log('lightPathes_of_shelve*', lightPathes_of_shelve);
    //هر سورس یه مجموعه ای از ***لایت پس ها*** داره به همراه سرویس هایی که در این لایتبس استفاده شده
    let lightPathes_of_source_withServices = allLightPathsWithServices_of_source(selectedSource, traffic);
    //console.log('lightPathes_of_source_withServices**', lightPathes_of_source_withServices);
    let counter = 0;
    //هر سورس یه مجموعه ای از ***گروم اوت ها*** داره به همراه سرویس هایش
    let groumOut_of_source_withServices = allGroomOutWithServices_of_source(selectedSource, traffic);
    //console.log('groomOut_of_source_withServices**', groumOut_of_source_withServices);
    //تمام دیمندهای مربوط به یک سورس
    let demonds_of_source_array = demonds_of_source(demonds, selectedSource);
    if (lightPathes_of_shelve) {
        for (const lightPathShelve of Object.entries(lightPathes_of_shelve)) {
            let flag = false;
            if (lightPathShelve[1].panel === 'MP1H' || lightPathShelve[1].panel === 'TP1H') {
                // //console.log(lightPathShelve[0], 'MP1HMP1H')
                for (let i = 0; i < lightPathes_of_source_withServices.length; i++) {

                    if (lightPathShelve[1].lightpath_id === lightPathes_of_source_withServices[i].id) {
                        // این لایت بس در شلف انتخابی هست بس در سورس هم هست
                        //console.log('########', lightPathes_of_source_withServices[i]);
                        let serviceWithType_of_lightPath = serviceWithType_of_lightPth_of_shelf(lightPathes_of_source_withServices[i].service_id_list, demonds_of_source_array);
                        let obj = {};
                        obj['lightpathId'] = lightPathShelve[1].lightpath_id ? lightPathShelve[1].lightpath_id : "";
                        obj['panel'] = lightPathShelve[1].panel;
                        obj['services'] = lightPathes_of_source_withServices[i].service_id_list;
                        obj['serviceWithType'] = serviceWithType_of_lightPath;
                        obj['place'] = counter;
                        obj['source'] = lightPathes_of_source_withServices[i].source;
                        obj['destination'] = lightPathes_of_source_withServices[i].destination;
                        obj['capacity'] = lightPathes_of_source_withServices[i].capacity;
                        obj['card_address'] = lightPathes_of_source_withServices[i].card_address;
                        useLightPath_shelves.push(obj);
                        //console.log("useLightPath_shelves",useLightPath_shelves);
                        flag = true;
                        break;
                    } else {
                        flag = false;
                    }
                }
            } else {
                //MP2X
                // //console.log(lightPathShelve[0], 'MP2XMP2X')
                for (let i = 0; i < groumOut_of_source_withServices.length; i++) {
                    if (groumOut_of_source_withServices[i].groomouts[lightPathShelve[1].groomout_id]) {
                        // //console.log('$$$ ', groumOut_of_source_withServices[i], lightPathShelve[1].groomout_id);
                        // if (lightPathShelve[1].lightpath_id == groumOut_of_source_withServices[i].id) {
                        // //console.log('groumOut_of_source_withServices[i] : ', groumOut_of_source_withServices[i].groomouts[lightPathShelve[1].groomout_id].id, lightPathShelve[1].groomout_id)
                        if (lightPathShelve[1].groomout_id === groumOut_of_source_withServices[i].groomouts[lightPathShelve[1].groomout_id].id) {
                            // //console.log("MP2X:",groumOut_of_source_withServices[i].groomouts[lightPathShelve[1].groomout_id].service_id_list);
                            let serviceWithType_of_groomout = serviceWithType_of_groomout_of_shelf(groumOut_of_source_withServices[i].groomouts[lightPathShelve[1].groomout_id].service_id_list, demonds_of_source_array);
                            //console.log("MP2X:",lightPathes_of_source_withServices);
                            let obj = {};
                            obj['lightpathId'] = lightPathShelve[1].lightpath_id ? lightPathShelve[1].lightpath_id : "";
                            obj['groomout_id'] = lightPathShelve[1].groomout_id
                            obj['panel'] = lightPathShelve[1].panel;
                            obj['services'] = groumOut_of_source_withServices[i].groomouts[lightPathShelve[1].groomout_id].service_id_list;
                            obj['serviceWithType'] = serviceWithType_of_groomout;
                            obj['place'] = counter;
                            obj['source'] = groumOut_of_source_withServices[i].source;
                            obj['destination'] = groumOut_of_source_withServices[i].destination;
                            obj['capacity'] = lightPathes_of_source_withServices[i].capacity;
                            obj['card_address'] = lightPathes_of_source_withServices[i].card_address;
                            useLightPath_shelves.push(obj);
                            flag = true;
                            break;
                        } else {
                            // //console.log('###############################')
                            flag = false;

                        }
                    }

                }
            }


            if (!flag) {
                //console.log(' auto ', lightPathShelve[1].panel);
                let obj = {};

                obj['lightpathId'] = lightPathShelve[1].lightpath_id ? lightPathShelve[1].lightpath_id : "";
                obj['groomout_id'] = lightPathShelve[1].groomout_id ? lightPathShelve[1].groomout_id : "";
                obj['panel'] = lightPathShelve[1].panel;
                obj['services'] = [];
                obj['place'] = counter;
                obj['source'] = lightPathShelve[1].source;
                obj['destination'] = lightPathShelve[1].destination;

                useLightPath_shelves.push(obj);
            }
            counter = counter + 1;
        }
    }
    //اگر هیچ لایت بسی نبود , length=0
    for (let i = 0; i < 14; i++) {

        if (useLightPath_shelves[i]) {

        } else {
            let obj = {};
            obj['lightpathId'] = "";
            obj['panel'] = '';
            obj['services'] = [];
            obj['place'] = i;
            useLightPath_shelves.push(obj);
        }
    }
    //console.log('***********', useLightPath_shelves);
    return useLightPath_shelves;
}

export function serviceWithType_of_lightPth_of_shelf(service_of_lightPath, filterDemands) {
    // //console.log('use service in one lighpath ', service_of_lightPath, 'filter demands for one source', filterDemands)
    // //console.log('create service', service_of_lightPath, filterDemands)
    let serviceWithType_of_lightPath = [];
    // //console.log('service_of_lightPath demands is : ', service_of_lightPath);
    // به ازای هر دیمندزاز سورس مورد نظر
    for (let i = 0; i < filterDemands.length; i++) {
        //به ازای سرویس های هر دیمندز
        for (let j = 0; j < filterDemands[i].services.length; j++) {

            for (let z = 0; z < service_of_lightPath.length; z++) {
                // //console.log('filterDemands[i].services demands', filterDemands[i].services[j].service_id_list, service_of_lightPath, service_of_lightPath[z].id);
                //اگر سرویس های موجود در هر لایت ‍‍‍‍بس برابر با سرویس های دیمندز بود
                if (filterDemands[i].services[j].service_id_list.includes(service_of_lightPath[z].id)) {
                    // //console.log('type of services *****', service_of_lightPath[z], filterDemands[i].services[j].service_id_list, service_of_lightPath[z].id);
                    service_of_lightPath[z].serviceType = filterDemands[i].services[j].type;
                } else {

                }
            }
            //یه فور دیگه برای مقایسه سرویس های استفاده شده از کل سرویس های هر دیمندز
        }
    }

    serviceWithType_of_lightPath = service_of_lightPath;
    // //console.log(serviceWithType_of_lightPath);
    return serviceWithType_of_lightPath;
}

export function serviceWithType_of_groomout_of_shelf(service_of_lightPath, filterDemands) {
    // //console.log('use service in one lighpath ', service_of_lightPath, 'filter demands for one source', filterDemands)
    // //console.log('create service', service_of_lightPath, filterDemands)
    let serviceWithType_of_lightPath = [];
    // //console.log('service_of_lightPath demands is : ', service_of_lightPath);
    // به ازای هر دیمندزاز سورس مورد نظر
    for (let i = 0; i < filterDemands.length; i++) {
        //به ازای سرویس های هر دیمندز
        for (let j = 0; j < filterDemands[i].services.length; j++) {

            for (let z = 0; z < service_of_lightPath.length; z++) {
                // //console.log('filterDemands[i].services demands', filterDemands[i].services[j].service_id_list, service_of_lightPath);
                //اگر سرویس های موجود در هر لایت ‍‍‍‍بس برابر با سرویس های دیمندز بود
                if (filterDemands[i].services[j].service_id_list.includes(service_of_lightPath[z].id)) {
                    // //console.log('type of services *****', service_of_lightPath[z], filterDemands[i].services[j].service_id_list, service_of_lightPath[z].id);
                    service_of_lightPath[z].serviceType = filterDemands[i].services[j].type;
                } else {

                }
            }
            //یه فور دیگه برای مقایسه سرویس های استفاده شده از کل سرویس های هر دیمندز
        }
    }

    serviceWithType_of_lightPath = service_of_lightPath;
    // //console.log(serviceWithType_of_lightPath);
    return serviceWithType_of_lightPath;
}

export function demonds_of_source(demonds, source) {

    let demonds_of_source_array = [];
    if (demonds) {
        for (const demand of Object.entries(demonds)) {

            if (demand[1].source === source) {
                // //console.log('demand', demand[1], source);
                demonds_of_source_array.push(demand[1]);
            }
        }
    }

    return demonds_of_source_array;
}

//=========================================================================
//این 3 تا تابع کپی هم هستن با خروجی های متفاوت به خاطر اینکه از هر شلو میشه
// لیست کارتها لیست لایت پستها و لیست گروم اوتها را دراورد
//lightPathes_of_shelve * cart_of_shelve * children_of_slots_of_shelve
export function lightPathes_of_shelve(shelve) {
    let cards = [];
    let children = [];
    let lightPathes = [];

    // let counter = 0;
    let place = 0;
    let groomout_id = [];
    let lightpath_id = [];

    for (const slots of Object.entries(shelve.slots)) {
        // counter = counter + 1;
        let objOfChildren = {};
        // //console.log(counter, 'every slots are : ', slots[1]);
        if (Object.keys(slots[1]).includes('lightpath_id')) {

            if (lightpath_id.includes(slots[1].lightpath_id)) {
                //در این مرحله یه لایت پس پر در ارایه داریم
                let counter = 1;
                for (let i = 0; i < lightpath_id.length; i++) {
                    if (lightpath_id[i] == slots[1].lightpath_id) {
                        counter++;
                        //console.log('***', counter, lightpath_id[i]);
                    }
                    if (counter === 2) {
                        //اگر دو تا لایت پس یکی داشته باشیم به ارایه اضافه میکنیم و لایت پس سوم در یه شلف نداریم
                        //لیست lightPathes
                        // lightPathes.push(slots[1].lightpath_id);
                        //**********************************
                        lightpath_id.push(slots[1].lightpath_id);
                        // cards.push(slots[1].panel);
                        objOfChildren['type'] = slots[1].panel;
                        objOfChildren['place'] = place;
                        objOfChildren['lightpath_id'] = slots[1].lightpath_id ? slots[1].lightpath_id : '';
                        // place = place + 1;
                        // children.push(objOfChildren);
                        break;
                    }
                }
            } else {
                //لیست lightPathes
                // lightPathes.push(slots[1].lightpath_id);
                //**********************************
                lightpath_id.push(slots[1].lightpath_id);
                cards.push(slots[1].panel);
                objOfChildren['type'] = slots[1].panel;
                objOfChildren['place'] = place;
                objOfChildren['lightpath_id'] = slots[1].lightpath_id ? slots[1].lightpath_id : '';
                place = place + 1;
                children.push(objOfChildren);
            }

        }
        if (Object.keys(slots[1]).includes('line1')) {
            if (groomout_id.includes(slots[1].line1.groomout_id)) {

            } else {
                groomout_id.push(slots[1].line1.groomout_id);
                cards.push(slots[1].panel);
                objOfChildren['type'] = slots[1].panel;
                objOfChildren['place'] = place;
                place = place + 1;
                children.push(objOfChildren);
            }
        }

    }
    return lightPathes;

}

export function cart_of_shelve(shelve) {

    let cards = [];
    let children = [];
    let lightPathes = [];

    // let counter = 0;
    let place = 0;
    let groomout_id = [];
    let lightpath_id = [];

    for (const slots of Object.entries(shelve.slots)) {
        // counter = counter + 1;
        let objOfChildren = {};
        // //console.log(counter, 'every slots are : ', slots[1]);
        if (Object.keys(slots[1]).includes('lightpath_id')) {

            if (lightpath_id.includes(slots[1].lightpath_id)) {
                //در این مرحله یه لایت پس پر در ارایه داریم
                let counter = 1;
                for (let i = 0; i < lightpath_id.length; i++) {
                    if (lightpath_id[i] == slots[1].lightpath_id) {
                        counter++;
                    }
                    if (counter === 2) {
                        //اگر دو تا لایت پس یکی داشته باشیم به ارایه اضافه میکنیم و لایت پس سوم در یه شلف نداریم
                        //لیست lightPathes
                        // lightPathes.push(slots[1].lightpath_id);
                        //**********************************
                        lightpath_id.push(slots[1].lightpath_id);
                        // cards.push(slots[1].panel);
                        objOfChildren['type'] = slots[1].panel;
                        objOfChildren['place'] = place;
                        objOfChildren['lightpath_id'] = slots[1].lightpath_id ? slots[1].lightpath_id : '';
                        // place = place + 1;
                        // children.push(objOfChildren);
                        break;
                    }
                }
            } else {
                //لیست lightPathes
                // lightPathes.push(slots[1].lightpath_id);
                //**********************************
                lightpath_id.push(slots[1].lightpath_id);
                cards.push(slots[1].panel);
                objOfChildren['type'] = slots[1].panel;
                objOfChildren['place'] = place;
                objOfChildren['lightpath_id'] = slots[1].lightpath_id ? slots[1].lightpath_id : '';
                place = place + 1;
                children.push(objOfChildren);
            }

        }
        if (Object.keys(slots[1]).includes('line1')) {
            if (groomout_id.includes(slots[1].line1.groomout_id)) {

            } else {
                groomout_id.push(slots[1].line1.groomout_id);
                cards.push(slots[1].panel);
                objOfChildren['type'] = slots[1].panel;
                objOfChildren['place'] = place;
                place = place + 1;
                children.push(objOfChildren);
            }
        }

    }

    return cards;

}

//این تابع لیست کارتها و جایگاهشون تو شلو و برمیگردونه
export function children_of_slots_of_shelve(shelve) {
    let cards = [];
    let children = [];
    let lightPathes = [];

    // let counter = 0;
    let place = 0;
    let groomout_id = [];
    let lightpath_id = [];

    for (const slots of Object.entries(shelve.slots)) {
        // counter = counter + 1;
        let objOfChildren = {};
        // //console.log(counter, 'every slots are : ', slots[1]);
        if (Object.keys(slots[1]).includes('lightpath_id')) {

            if (lightpath_id.includes(slots[1].lightpath_id)) {
                //در این مرحله یه لایت پس پر در ارایه داریم
                let counter = 1;
                for (let i = 0; i < lightpath_id.length; i++) {
                    if (lightpath_id[i] == slots[1].lightpath_id) {
                        counter++;
                        // //console.log('***', counter, lightpath_id[i]);
                    }
                    if (counter === 2) {
                        //اگر دو تا لایت پس یکی داشته باشیم به ارایه اضافه میکنیم و لایت پس سوم در یه شلف نداریم
                        //لیست lightPathes
                        // lightPathes.push(slots[1].lightpath_id);
                        //**********************************
                        lightpath_id.push(slots[1].lightpath_id);
                        // cards.push(slots[1].panel);
                        objOfChildren['type'] = slots[1].panel;
                        objOfChildren['place'] = place;
                        objOfChildren['lightpath_id'] = slots[1].lightpath_id ? slots[1].lightpath_id : '';
                        // place = place + 1;
                        // children.push(objOfChildren);
                        break;
                    }
                }
            } else {
                //لیست lightPathes
                // lightPathes.push(slots[1].lightpath_id);
                //**********************************
                lightpath_id.push(slots[1].lightpath_id);
                cards.push(slots[1].panel);
                objOfChildren['type'] = slots[1].panel;
                objOfChildren['place'] = place;
                objOfChildren['lightpath_id'] = slots[1].lightpath_id ? slots[1].lightpath_id : '';
                place = place + 1;
                children.push(objOfChildren);
            }

        }
        if (Object.keys(slots[1]).includes('line1')) {
            if (groomout_id.includes(slots[1].line1.groomout_id)) {

            } else {
                groomout_id.push(slots[1].line1.groomout_id);
                cards.push(slots[1].panel);
                objOfChildren['type'] = slots[1].panel;
                objOfChildren['place'] = place;
                place = place + 1;
                children.push(objOfChildren);
            }
        }

    }
    return children;
}

//==========================================================================
export function standardShelves(shelves) {
    let allShelves_of_rack_of_source = [];
    if (shelves) {
        for (const item of Object.entries(shelves)) {
            // //console.log(' ********** every shelve is *********: ', item[1]);
            let cards = cart_of_shelve(item[1]);
            // lightPathes = lightPathes_of_shelve(item[1]);
            let children = children_of_slots_of_shelve(item[1]);
            // //console.log('cards are : ', cards);
            let newId = allShelves_of_rack_of_source.length + 1;
            allShelves_of_rack_of_source.push({
                id: newId,
                name: `shelf${newId}`,
                children: children,
                carts: cards

            });

        }
    }
    return allShelves_of_rack_of_source;
}

//TODO:shod be check
export function check(lightPathes, traffic) {
    let services = [];
    let newLightPathes = [];
    let newLightPathesTrafic = [];
    for (let z = 0; z < lightPathes.length; z++) {
        let objLightPathes = {};
        objLightPathes['id'] = z + 1;
        objLightPathes['name'] = lightPathes[z];

        for (const lightpaths_in_traficFile of Object.entries(traffic.main.lightpaths)) {

            if (lightPathes[z] === lightpaths_in_traficFile[0]) {
                let objLightPathesTrafic = {};
                objLightPathesTrafic['id'] = z + 1;
                objLightPathesTrafic['name'] = lightpaths_in_traficFile[1].destination;
                newLightPathesTrafic.push(objLightPathesTrafic);
                //لیست سرویس هایی از ورودی  که به lightPathes خروجی وصل هستن
                services.push(lightpaths_in_traficFile[1].service_id_list)
            }

        }
        newLightPathes.push(objLightPathes);

    }
}

export function services_of_demands(selectedSourceText, selectedDestinationText, demands) {

    let newServices = [];
    let newServicesList = [];
    let jsonDemands = demands;
    // //console.log(' every demands start... ');
    for (const everyDemands of Object.entries(jsonDemands)) {

        if (everyDemands[1]) {
            if (everyDemands[1].source === selectedSourceText
                && everyDemands[1].destination === selectedDestinationText
            ) {
                //console.log(' everyDemands of demands is : ', everyDemands[1], selectedSourceText, selectedDestinationText);
                //دیمندز با سورس و مقصد مشخص
                // //console.log('we have it ');
                let flag = false;
                //در هر دیمندز ممکن هست بیش از یک رکورد مربوط به سرویس ها باشد(هر رکورد یک نوع سرویس)
                // و هر رکورد از سرویس ها ارایه ای دارد که تعداد سرویس ها را نشان میدهد
                for (let i = 0; i < everyDemands[1].services.length; i++) {

                    // //console.log(newServicesList.includes(everyDemands[1].services[i].type), newServicesList, everyDemands[1].services[i].type, everyDemands[1].services.length);
                    //
                    if (newServicesList.includes(everyDemands[1].services[i].type)) {
                        flag = false
                    } else {
                        // newServices.push(everyDemands[1].services[i].type)
                        flag = true;
                    }
                    if (flag) {
                        newServicesList.push(everyDemands[1].services[i].type);
                        // //console.log('add services', everyDemands[1].services);
                        newServices.push({
                            id: i + 1,
                            name: everyDemands[1].services[i].type,
                            type: everyDemands[1].services[i].type,
                            services: everyDemands[1].services[i]
                            // count: everyDemands[1].services[i].service_id_list.length
                        });
                    }
                }
            }
        }
    }
    return newServices
}

export function lightPath_of_demand_of_traffics(lightPath, selectedSourceText, selectedDestinationText) {
    let newLightPath = [];
    let newLightPathList = [];
    let i = 0;
    //console.log('every lightPath_of_traffics start : ',lightPath);
    //console.log('every lightPath_of_traffics start : ',selectedSourceText);
    //console.log('every lightPath_of_traffics start : ',selectedDestinationText);

    for (const everyLightPath of Object.entries(lightPath)) {
        //console.log(' we have it every lightPath_of_traffics is :', everyLightPath[1]);
        if (everyLightPath[1]) {
            if (everyLightPath[1].source === selectedSourceText
                && everyLightPath[1].destination === selectedDestinationText
            ) {
                //console.log('********* we have it ************* ', everyLightPath[1].source, everyLightPath[1].destination, everyLightPath[1]);
                let flag = false;
                if (newLightPathList.includes(everyLightPath[1].lightpath_id)) {
                    flag = false
                } else {
                    flag = true;
                }
                if (flag) {

                    newLightPathList.push(everyLightPath[1].destination);
                    //console.log('add LightPath', everyLightPath[1].id);
                    newLightPath.push({
                        id: i + 1,
                        name: everyLightPath[1].destination,
                        type: everyLightPath[1].destination,
                        lightPath: everyLightPath[1].id,
                        source: everyLightPath[1].source,
                        destination: everyLightPath[1].destination,
                        capacity: everyLightPath[1].capacity,
                        card_address: everyLightPath[1].card_address,

                        // count: everyDemands[1].services[i].service_id_list.length
                    });
                    i = i + 1;
                }

            }
        }
    }
    return newLightPath
}

export function filterDemands_RemoveService(demands, selectedSourceText, selectedDestinationText, serviceName, lastHome) {

    //console.log(' every demands start... ', selectedSourceText, selectedDestinationText);
    for (const everyDemands of Object.entries(demands)) {
        // //console.log(' everyDemands of demands is : ', everyDemands[1], selectedSourceText, selectedDestinationText);
        if (everyDemands[1]) {
            if (everyDemands[1].source === selectedSourceText
                && everyDemands[1].destination === selectedDestinationText
            ) {
                //console.log('everyDemands is : ', everyDemands[1].services, serviceName, lastHome);
                for (const service of Object.entries(everyDemands[1].services)) {


                    if (service[1].type === serviceName) {
                        //console.log(service[1].service_id_list);
                    }

                }

            }
        }
    }
    return demands;

}


export function unUseServicesInDemands(services_of_demands, traffics) {
    //در دیمندز کل سرویسها هست چه استفاده شده چه نشده
    // let unUseServicesInDemands = services_of_demands;
    //به ازای تک تک ترافیک ها
    for (const everyLightPath of Object.entries(traffics)) {
        // //console.log('**********everyLightPath****************', everyLightPath[1].source) 
        // به ازای سرویس های موجود در لایت بسهای موجود در فایل ترافیک
        for (let j = 0; j < everyLightPath[1].service_id_list.length; j++) {
            //به ازای  سرویس های موجود در دیمندز
            // //console.log('every service in traffic  :', everyLightPath[1].service_id_list[j])
            for (let i = 0; i < services_of_demands.length; i++) {


                // //console.log('service in demands : ', services_of_demands[i].services.service_id_list)
                for (let z = 0; z < services_of_demands[i].services.service_id_list.length; z++) {
                    // //console.log(services_of_demands[i].services.service_id_list[z], everyLightPath[1].service_id_list[j].id)
                    if (services_of_demands[i].services.service_id_list[z] === everyLightPath[1].service_id_list[j].id) {
                        //این سرویس مورد نظر باید از سرویس های دیمندز کم شود
                        //console.log('removed service from demands', everyLightPath[1].service_id_list[j].id);

                        removeFromYourArray(services_of_demands[i].services.service_id_list, services_of_demands[i].services.service_id_list[z])
                    }

                }
            }


        }
    }
    return services_of_demands;
}

export function unUseServicesInDemands_MP2X(services_of_demands, traffics) {
    //در دیمندز کل سرویسها هست چه استفاده شده چه نشده
    // let unUseServicesInDemands = services_of_demands;
    //به ازای تک تک ترافیک ها
    for (const everyTraffic of Object.entries(traffics)) {
        // //console.log('**********everyLightPath****************', everyLightPath[1].source)
        // به ازای سرویس های موجود در لایت بسهای موجود در فایل ترافیک
        // //console.log('***********************', everyTraffic[1].groomouts);
        for (const groomout of Object.entries(everyTraffic[1].groomouts)) {


            // //console.log(groomout[1], groomout[1].service_id_list);
            for (let j = 0; j < groomout[1].service_id_list.length; j++) {
                //به ازای  سرویس های موجود در دیمندز
                // //console.log('every service in traffic  :', everyLightPath[1].service_id_list[j])
                for (let i = 0; i < services_of_demands.length; i++) {


                    // //console.log('service in demands : ', services_of_demands[i].services.service_id_list)
                    for (let z = 0; z < services_of_demands[i].services.service_id_list.length; z++) {
                        // //console.log(services_of_demands[i].services.service_id_list[z], groomout[1].service_id_list[j])
                        if (services_of_demands[i].services.service_id_list[z] === groomout[1].service_id_list[j].id) {
                            //این سرویس مورد نظر باید از سرویس های دیمندز کم شود
                            //console.log('removed service from demands', groomout[1].service_id_list[j].id);
                            removeFromYourArray(services_of_demands[i].services.service_id_list, services_of_demands[i].services.service_id_list[z])
                        }

                    }
                }


            }
        }
    }
    return services_of_demands;
}

export function removeFromYourArray(array, removeParam) {
    if (array.length > 0) {
        const index = array.indexOf(removeParam);
        //اگه مقدار تو ارایه بود پاک کن نبود خانه اخر و پاک کن
        if (index > -1) {
            array.splice(index, 1);
        } else {
            array.splice(array.length - 1, 1);
        }
    }

    return array;

}

export function standardMapping(source, racks, shelf, slots) {
    //console.log('mapping is : ', racks, shelf, slots);
    let standardMapObj = {};
    let cardData = new CardData();
    let cardStorageArr = cardData.getCardArr();
    let size = 1;
    let newSlots = [];
    if (slots === 'new') {
        createBasicShelf('array')
    } else {
        //console.log('******slots are*****', slots);
        newSlots = slots.map((row, index) => {
            if (row.panel) {
                let card = cardStorageArr.filter(card => card.textLabel === row.panel);
                if (card[0]) {
                    size = card[0].size;
                } else {
                    size = 1;
                    //console.log('you dont have this cart...');
                }
            }
            let objFill = {};
            objFill['type'] = 'pattern';
            objFill['pattern'] = "solid";
            objFill['fgColor'] = {argb: '00F2DCDB'};
            return {...row, id: index, name: row.panel ? row.panel : "", size: size ? size : 1, fill: objFill}
        });
    }
    if (shelf === 'new') {
        let shelfArray = [];
        let shelfObj = {};
        shelfObj['cards'] = newSlots;
        shelfObj['id'] = 1;
        shelfObj['name'] = 'shelf1';

        shelfArray.push(shelfObj);
        if (racks[0]) {
            racks[0]['shelves'] = shelfArray;
            racks[0]['address'] = racks[0].name;
            let racksArray = [];
            racksArray.push(racks[0]);
            standardMapObj['Racks'] = racksArray;
            standardMapObj['id'] = 1;
            standardMapObj['name'] = source;
        }

    } else {
        if (shelf[0]) {
            shelf[0]['cards'] = newSlots;
            let shelfArray = [];
            shelfArray.push(shelf[0]);

            if (racks[0]) {
                racks[0]['shelves'] = shelfArray;
                racks[0]['address'] = racks[0].name;
                let racksArray = [];
                racksArray.push(racks[0]);
                standardMapObj['Racks'] = racksArray;
                standardMapObj['id'] = 1;
                standardMapObj['name'] = source;
            }
        }
    }

    let mappingArray = [];
    mappingArray.push(standardMapObj);
    //console.log('mapping 2 ', mappingArray);
    return mappingArray;

}

export function racks_of_serverFile(selectedSource, racks_of_serverFile) {
    //console.log(racks_of_serverFile)
    if (racks_of_serverFile) {
        //console.log(racks_of_serverFile.nodes, racks_of_serverFile.nodes[selectedSource])
        if (racks_of_serverFile.nodes[selectedSource]) {
            //console.log(racks_of_serverFile.nodes)
            return racks_of_serverFile.nodes[selectedSource].racks
        } else {
            return []
        }
    } else {
        return []
    }

}

