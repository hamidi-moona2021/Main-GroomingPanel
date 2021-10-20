import React from 'react';
import './card.css';
import DragAndDrop from "../Modules/DragAndDrop";

export class CardStorage extends DragAndDrop {
    state = {currentShelf: {}};

    constructor(props) {
        super(props);
        this.state.currentShelf = this.props.cardArray[0];
    }

    drop(ev, arr) {
        //console.log('****')
        this.setState({currentShelf: {...super.drop(ev, arr)}});
    }

    render() {
        return (
            // <div className="list-group p-0 m-0 card--storage overflow-y">
            //
            // </div>
            <div style={{
                marginBottom: '8px',
                border: 'inherit',
                overflowX: "scroll",
                display: 'flex',
                flexWrap: 'unset'
            }}>
                {/*<p className="text-center" style={{color: "gold"}}>Network Cards</p>*/}

                {
                    this.props.cardArray.map(item =>
                        <div key={`card${item.id}`} style={{float: 'left', padding: '5px'}}>
                            <li
                                key={item.id}
                                type="button"

                                className="cursor text-center storage--list--item"
                                draggable="true"
                                onDragStart={(ev) => this.drag(ev, item.id)}
                            >
                                {item.textLabel === "" ? "Empty card" : item.textLabel}
                            </li>
                        </div>)
                }
            </div>
            // {/*<section*/}
            // {/*    className="d-inline-block"*/}
            // {/*    onDragOver= {this.allowDrop}*/}
            // {/*    onDrop={(ev) => this.drop(ev, this.props.cardArray)}*/}
            // {/*>*/}
            // {/*    <Card key={this.state.currentShelf.id}*/}
            // {/*          num={1}*/}
            // {/*          textLabel={this.state.currentShelf.textLabel}*/}
            // {/*          bgColor={this.state.currentShelf.bgColor}*/}
            // {/*          size={this.state.currentShelf.size}*/}
            // {/*    />*/}
            // {/*</section>*/}
        );
    };
}

export default CardStorage;