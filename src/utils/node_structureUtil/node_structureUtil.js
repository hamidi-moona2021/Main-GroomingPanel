import { getServiceDeviceCartWithDeviceId } from "../util";

export function node_structure_mapping(nodeStructure, service_devices) {

    let newNodeStructure = nodeStructure;
    for (const node of Object.entries(nodeStructure.nodes)) {

        // console.log('node_structure mapping node is :', node[0], 'racks are : ', Object.keys(node[1].racks).length);

        for (const racks of Object.entries(node[1].racks)) {
            // console.log('***rack**** node_structure mapping rack is :', racks[1]);
            for (const shelves of Object.entries(racks[1].shelves)) {
                // console.log('###shelf### node_structure mapping :', shelves[1]);
                let newSlots = {};
                // به ازای هر اسلات

                for (let i = 0; i < 14; i++) {

                    let slot = getServiceDeviceCartWithDeviceId(service_devices, shelves[1].slots[i]);
                    // console.log('slot', slot ? slot.lightpath_id : "", 'slot2 ', shelves[1].slots[i])
                    let panelName = slot ? slot.panel : "";
                    let groomout_id = '';
                    let demand_id = '';


                    if (panelName === 'MP2X') {

                        if (i % 2 === 0) {

                            if (Object.keys(slot).includes('line1')) {
                                groomout_id = slot.line1 ? slot.line1.groomout_id : '';
                                demand_id = slot.line1.demand_id ? slot.line1.demand_id : '';


                            } else {
                                groomout_id = '';
                                demand_id = '';

                            }
                        }
                        if (i % 2 !== 0) {
                            if (Object.keys(slot).includes('line2')) {
                                groomout_id = slot.line2 ? slot.line2.groomout_id : '';
                                demand_id = slot.demand_id ? slot.demand_id : '';
                            } else {
                                groomout_id = '';
                                demand_id = '';


                            }
                        }

                    }
                    newSlots[i] = {

                        i: shelves[1].slots[i],
                        fill: { "type": "pattern", pattern: "solid", fgColor: { argb: "00F2DCDB" } },
                        id: 0,
                        lightpathId: slot ? slot.lightpath_id ? slot.lightpath_id : "" : "",
                        groomout_id: groomout_id,
                        demand_id: demand_id,
                        name: slot ? slot.panel : "",
                        panel: "",
                        place: 0,
                        serviceWithType: [],
                        services: [],
                        size: 1
                    }
                    // let lit = shelves[1].slots[i];
                    //  newSlot[i] = lit;
                    //  newSlot['lightPath'] = lit;
                    // console.log('**** node_structure mapping ', lit);

                }
                shelves[1].slots = newSlots;
                // shelves[1].slots = {test: 1, slots: newSlots};
                // console.log('###shelf### node_structure mapping :', shelves[1].slots);
            }
        }

    }


    return newNodeStructure;
}

export function node_structure_mapping_final(nodeStructure) {

    let newNodeStructure = nodeStructure;
    for (const node of Object.entries(nodeStructure.nodes)) {

        // console.log('node_structure mapping node is :', node[0], 'racks are : ', Object.keys(node[1].racks).length);

        for (const racks of Object.entries(node[1].racks)) {
            // console.log('***rack**** node_structure mapping rack is :', racks[1]);
            for (const shelves of Object.entries(racks[1].shelves)) {
                // console.log('###shelf### node_structure mapping :', shelves[1]);
                let newSlots = {};
                // به ازای هر اسلات
                for (let i = 0; i < 14; i++) {
                    shelves[1].slots[i]=shelves[1].slots[i].i;
                }
            }
        }
    }
    console.log('newNodeStructure : ', newNodeStructure)
    return newNodeStructure;
}

