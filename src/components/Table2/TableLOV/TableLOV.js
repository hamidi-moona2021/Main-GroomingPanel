import React, {PureComponent} from 'react';
import LOV from "../LOV/LOV";
import LOVSearch from "../LOV/LOVSearch";
import LOVLikeTable from "../LOV/LOVLikeTable";

class TableLOV extends PureComponent {

    state = {
        // user: this.props.user
    };

    constructor(props) {
        super(props);
    }

    controlSelect = (selectOptions, key) => {

        /**
         * selectOptions is one row of path that path is set in setting => path in setting is array that
         * every row in path is => one list of value = one (LOV)
         * @keysSelectOptions is name of columns that come from server
         */

        if (selectOptions) {

            if (selectOptions[key] && selectOptions[key].length > 0) {

                if (selectOptions.show && selectOptions.set) {
                    /**
                     * keysSelectOptions ===> [{ id :1, name :'test1'},{ id :2, name :'test2'}] ===> [id,name]
                     */
                    let keysSelectOptions = (Object.keys((selectOptions[key])[0]));
                    if (keysSelectOptions.includes(selectOptions.show) && keysSelectOptions.includes(selectOptions.set)) {
                        if (this.props.type === 'LOVLikeTable') {

                            return <LOVLikeTable> </LOVLikeTable>

                        } else if (this.props.search && this.props.type === 'LOV') {
                            var flagDefault = 'add';
                            var defaultColumn = '';
                            // console.log('****************', this.props.selected, typeof this.props.selected)
                            if (this.props.selected === 0 || this.props.selected) {
                                // console.log('selected')
                                for (let i = 0; i < selectOptions[key].length; i++) {
                                    // console.log(((selectOptions[key])[i])[selectOptions.set] === this.props.selected, ((selectOptions[key])[i])[selectOptions.set])
                                    if (((selectOptions[key])[i])[selectOptions.set] === this.props.selected) {
                                        flagDefault = 'edit';
                                        // console.log('edit', ((selectOptions[key])[i])[selectOptions.set], ((selectOptions[key])[i])[selectOptions.show]);
                                        defaultColumn = ((selectOptions[key])[i])[selectOptions.show];

                                    }
                                }
                            }

                            return <LOVSearch pk={this.props.pk} /*user={this.props.user}*/
                                              set={selectOptions.set}
                                              selected={flagDefault === 'edit' ? defaultColumn : this.props.selected}
                                              show={selectOptions.show} /*keysSelectOptions={keysSelectOptions}*/
                                              FromDetailForAddUserForm={this.props.FromDetailForAddUserForm}
                                              options={selectOptions[key]} columnName={key}/>

                        } else {
                            // console.log('$$$$$$$$$$$$$$', selectOptions[key])
                            return <LOV pk={this.props.pk} selected={this.props.selected} set={selectOptions.set}
                                        show={selectOptions.show}
                                        FromDetailForAddUserForm={this.props.FromDetailForAddUserForm}
                                /*keysSelectOptions={keysSelectOptions} user={this.props.user}*/
                                        options={selectOptions[key]}
                                        columnName={key}/>
                        }
                    } else {
                        return <select defaultValue={""}>
                            <option id={'select0'} value=""></option>
                            <option value="no">no items</option>

                        </select>
                    }


                } else {
                    console.log('please set show and set param');

                    return <select defaultValue={""}>

                        <option value=""></option>
                        <option value="no">no items</option>

                    </select>
                }

            } else {
                return <select defaultValue={""}>

                    <option value=""></option>
                    <option value="no">no items</option>

                </select>

            }

        } else {
            return <select defaultValue={""}>

                <option value=""></option>
                <option value="no">no items</option>

            </select>
        }


    };

    render() {
        // console.log('i am tableLOV ', this.props.selectOptions);
        return (
            <>
                {this.controlSelect(this.props.selectOptions, this.props.orgKey)}
            </>
        );
    }
}

export default TableLOV;
