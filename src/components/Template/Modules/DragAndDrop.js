import {Component} from 'react';

export class DragAndDrop extends Component {
    allowDrop(ev) {
        ev.preventDefault();
    }

    drag(ev, id) {
        //console.log('drag', id);
        ev.dataTransfer.setData("id", id);
    }

    drop(ev, arr, type) {
        //console.log('drop', ev.target, arr, type)
        ev.preventDefault();
        const id = ev.dataTransfer.getData("id");
        return {...arr.filter(item => item.id === id)[0]};
    }


}

export default DragAndDrop;