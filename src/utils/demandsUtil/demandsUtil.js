import { keys } from "lodash";
import config from "../../config";

export function demandsServerCheck(demandsFromProps) {
    let demands = null;
    if (config.server) {
        demands = demandsFromProps;
    } else {
        demands = config.demands;
    }
    return demands
}

export function demands_mapping(demands) {

    // console.log('demand are : ', demands);
    let obj = {};
    let counter = 0
    for (const [key, value] of Object.entries(demands)) {

        counter = counter + 1;
    }
    // console.log('counter', counter);
    for (const [key, value] of Object.entries(demands)) {
        // obj[key] = value;
        obj[key] = { ...value };
        let mirrorObj = { ...value, source: value.destination, destination: value.source };
        let newKey = parseInt(key) + counter;
        // console.log(newKey);
        obj[newKey] = mirrorObj;
    }
    // console.log('demand are : ', obj);
    return obj
}

export function find_demandId_from_source_destination(demandsFile, source, destination) {
    let demandsFilter = {};
    // console.log(source, destination);
    for (const demands of Object.entries(demandsFile)) {
        // console.log(demands[1].source === source, demands[1].destination === destination);
        if (demands[1].source === source && demands[1].destination === destination) {
            demandsFilter = demands[1];
            break;
        } else {

        }
    }
    return demandsFilter;
}