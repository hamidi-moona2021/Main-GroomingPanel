import React, {PureComponent} from 'react';
import './LOV.css'

class LOV extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        // user: this.props.user
        column: this.props.columnName
    };

    onChangeLOV = (e, column) => {

        this.props.FromDetailForAddUserForm('LOV', e, column);
    };

    render() {
        // console.log('im am LOV',this.props.options);
        let column = this.state.column;
        let set = this.props.set;
        let show = this.props.show;
        let options = this.props.options;
        let selected = this.props.selected;

        return (
            <>
                {this.props.options.length > 0 ?
                    <select id={this.props.pk} onChange={(e) => {
                        this.onChangeLOV(e, column)
                    }} value={selected}>

                        <option id={'select0'} value="0"></option>
                        {/*{this.props.options}*/}
                        {options.map((key, index) => {
                            return <option
                                key={'option' + index}
                                value={(key)[set]}> {(key)[show]}</option>
                        })}
                    </select>

                    : <select defaultValue={""}>
                        <option id={'select'} value=""></option>
                        <option value="no">no items</option>

                    </select>}
            </>
        );
    }
}

export default LOV;
