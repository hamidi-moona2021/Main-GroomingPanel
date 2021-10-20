import React, {PureComponent} from 'react';
import './AddUserForm.css'
import {Col, Row} from "reactstrap";
import DatePicker from "react-datepicker2";
import moment from "moment-jalaali";
import logo from './../../../../assets/img/brand/logo.svg'
import TableLOV from "./../TableLOV/TableLOV";
import CheckBox from './../CheckBox/CheckBox';
import axios from 'axios';
import config from './../../../../config'
import {
    isRealValue,
    isFunction,
    orderFunction,
    controlTypeColumnsComponent,
    controlHeaders,
    controlHeadersForValidateRequired
} from './../utils/utils'

class AddUserForm extends PureComponent {

    constructor(props) {
        super(props);
    }

    state = {
        base64: logo,
        user: this.props.initialFormState,
        // checkBox: false,
        isGregorian: true,
        selectColumns: this.props.selectColumns
    };

    componentDidMount() {
        let token = sessionStorage.getItem('token');
        var ref = this;
        const headers = {
            'Content-Type': 'application/json'
        };
        let selectColumns = this.props.selectColumns;
        if (selectColumns) {


            if (selectColumns.path && selectColumns.columns) {

                selectColumns.columns.map((key, index) => {
                    let flagNotError = false;
                    for (let s = 0; s < selectColumns.path.length; s++) {

                        if (Object.keys((selectColumns.path[s])).includes(key)) {
                            flagNotError = true;
                            var selectOptions = (selectColumns.path[s]);

                            if (selectOptions['server'] === 'server') {
                                let path = selectOptions[key];
                                //console.log('LOV SERVICE : ', config.baseURL + path);
                                axios.post(config.baseURL + path, {token}, {
                                    headers: headers
                                })
                                    .then(function (response) {
                                         // //console.log(response.data);
                                        if (response.data.result) {
                                            ref.setState({[key]: response.data.result});
                                        } else {
                                            //console.log('axios error');
                                        }
                                    })
                                    .catch(function (error) {
                                        //console.log(error);
                                    })
                                    .finally(function () {

                                    });
                            }
                        } else {
                            if (s === selectColumns.path.length - 1 && flagNotError === false)
                                console.log('اسم ستون موردنظر اشتباه است لطفا در قسمت {مسیرها} اسم ستون مورد نظر را به درستی وارد کنید')
                        }
                    }
                })
            }
        }


    }

    getCustomFormat(inputValue, isGregorian) {
        if (!inputValue)
            return '';
        // if (!this.isFunction(inputValue))
        if (!isFunction(inputValue))
            return '';
        const inputFormat = isGregorian ? 'YYYY/M/D' : 'jYYYY/jM/jD';
        return isGregorian ? inputValue.locale('es').format(inputFormat) :
            inputValue.locale('fa').format(inputFormat);
    }

    handleInputChange = event => {

        if (event.target.type === 'text') {

            const {name, value} = event.target;
            this.setState({user: {...this.state.user, [name]: value}})

        }

        if (event.target.type === 'file') {

            const {name, files} = event.target;
            let file = files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                this.setState({
                    user: {...this.state.user, [name]: reader.result},
                    file: file,
                    base64: reader.result
                });
            };
        }

    };

    returnAddForm = (g, column) => {
        let flagbeforeRenderTrigerAddForm = false;
        let specialComponentEveryRow = controlTypeColumnsComponent(this.props.checkBoxColumns, this.props.uploadFileColumns, this.props.selectColumns, this.props.DatePickerColumns);

        /**********************************************
         ***** newRender if there is triger for it ****
         **********************************************/
        let newRender = [];
        if (this.props.beforeRenderTrigerAddForm) {

            newRender = this.props.beforeRenderTrigerAddForm(this.props.renderInsert, this.state.user)
            // if (newRender && Array.isArray(newRender) && this.isRealValue(newRender)) {
            if (newRender && Array.isArray(newRender) && isRealValue(newRender)) {
                flagbeforeRenderTrigerAddForm = true;
            } else {
                flagbeforeRenderTrigerAddForm = false
            }

        }

        return column.map((key, index) => {

            if ((index + 1) % 2 === g) {

                if (flagbeforeRenderTrigerAddForm) {

                    // let newRender = this.props.beforeRenderTrigerAddForm(this.props.renderInsert, this.state.user)
                    if (newRender) {
                        //console.log(' beforeRenderTrigerAddForm is executed')
                        if (newRender.includes(key)) {
                            return null;
                        }
                    }

                } else if (this.props.renderInsert) {
                    if (this.props.renderInsert.includes(key)) {
                        return null;
                    }
                }

                /**
                 * z = every special components = @specialComponent EveryRow is all specials components with columnsName that have this  like [{checkBox: "checkBox", columns: Array(1)}]
                 *  is work just for special col of row table
                 */
                for (let z = 0; z < specialComponentEveryRow.length; z++) {
                    // //console.log('row ', i, ' column ', h, array_of_columns[h], ' spec ', z, specialComponentEveryRow[z].columns);
                    // //console.log('specialComponentEveryRow', specialComponentEveryRow[z])
                    if (specialComponentEveryRow[z].columns) {
                        /**
                         * if every columns(is property => is array of columns with specials components)
                         * of every  row of specialComponentEveryRow equal with every column of row of table
                         * return the first home of object that =>is name of components that pass it to switch
                         */
                        if (specialComponentEveryRow[z].columns.includes(key)) {

                            var switchComponents = (Object.keys(specialComponentEveryRow[z]))[0];

                            if (switchComponents === 'select') {
                                if (specialComponentEveryRow[z].path) {
                                    for (let s = 0; s < specialComponentEveryRow[z].path.length; s++) {

                                        if (Object.keys((specialComponentEveryRow[z].path[s])).includes(key)) {
                                            /**
                                             * if clintSide so selectOptions===>read from setting
                                             * if serverSide so selectOptions===>read from state
                                             * selectOptions is one row of path that path is set in setting => path in setting is array that
                                             *every row in path is => one list of value = one (LOV)
                                             */
                                            var selectOptions = (specialComponentEveryRow[z].path[s]);
                                            if (this.state[key]) {
                                                selectOptions = {...selectOptions, [key]: this.state[key]}
                                            }

                                            if (specialComponentEveryRow[z].search) {
                                                var search = specialComponentEveryRow[z].search;
                                                var type = specialComponentEveryRow[z].type;

                                            } else {
                                                var search = false;
                                            }

                                        }
                                    }
                                } else {
                                    //console.log('select dont have path');
                                }
                            }
                        }
                    }
                }
                // //console.log('switchComponents', switchComponents)
                switch (switchComponents) {

                    case "checkBox":

                        this.state.checkBox = (key != null ? key : false);
                        return <div key={index}>

                            {controlHeaders(key, index, '', this.props.headersDesc, this.props.requiredInsert)}
                            <CheckBox
                                pk={`select${index}`}
                                FromDetailForAddUserForm={this.FromDetailForAddUserForm}
                                idColumn={column[index]}
                                indexColumn={index}
                                checked={false}
                                columnName={key}/>

                        </div>;
                    case "uploadFile":

                        return <div key={index}>

                            {controlHeaders(key, index, '', this.props.headersDesc, this.props.requiredInsert)}

                            <input id={`input${column[index]}`}
                                   key={'input' + index}
                                   type="file"
                                   name={key}
                                   onChange={this.handleInputChange}/>
                            <img style={{width: '30px', height: '30px'}} src={this.state.base64}/>
                        </div>;


                    case 'select':
                        // //console.log('state and selectOption : ', this.state, selectOptions)

                        return <div key={index}>
                            {controlHeaders(key, index, '', this.props.headersDesc, this.props.requiredInsert)}
                            <TableLOV pk={`select${index}`} type={type} search={search}
                                      FromDetailForAddUserForm={this.FromDetailForAddUserForm}
                                      orgKey={key}
                                      orgIndex={index} selectOptions={selectOptions}/>
                        </div>;

                    case 'DatePicker':
                        return <div style={{position: 'relative'}} key={index}>
                            {controlHeaders(key, index, 'DatePicker', this.props.headersDesc, this.props.requiredInsert)}

                            <DatePicker
                                timePicker={false}
                                // value={this.state.value}
                                // value={this.isFunction(this.state.user[key]) ? this.state.user[key] : moment()}
                                value={isFunction(this.state.user[key]) ? this.state.user[key] : moment()}
                                isGregorian={!this.state.isGregorian}
                                onChange={value => this.setState({
                                    user: {
                                        ...this.state.user,
                                        [key]: value
                                    }
                                })}

                            />

                            <input style={{position: 'absolute', top: 0, right: '270px'}}
                                   disabled={true}
                                   id={`input${column[index]}`}
                                   placeholder={this.props.headersDesc[key]}
                                   key={'input' + index} type="text"
                                   name={column[index]}
                                // value={this.isFunction(this.state.user[key]) ? this.getCustomFormat(this.state.user[key], true) : (moment(this.state.user[key], 'jYYYY/jM/jD').isValid() ? this.getCustomFormat(moment(this.state.user[key], 'jYYYY/jM/jD'), true) : this.getCustomFormat(moment(), true))}
                                   value={isFunction(this.state.user[key]) ? this.getCustomFormat(this.state.user[key], true) : (moment(this.state.user[key], 'jYYYY/jM/jD').isValid() ? this.getCustomFormat(moment(this.state.user[key], 'jYYYY/jM/jD'), true) : this.getCustomFormat(moment(), true))}
                                   onChange={this.handleInputChange}/>

                        </div>;

                    default:
                        return <div key={index}>

                            {controlHeaders(key, index, '', this.props.headersDesc, this.props.requiredInsert)}
                            <input id={`input${index}`}
                                   placeholder={this.props.headersDesc[key]}
                                   key={'input' + index} type="text"
                                   name={column[index]}
                                   value={this.state.user[column[index]] != null ? this.state.user[column[index]] : ''}
                                   onChange={this.handleInputChange}/>
                        </div>
                }
                return [];
            }
        })

    };

    cancelButton = () => {
        this.props.controlPopUp(0);
    };

    FromDetailForAddUserForm = (keyFromDetail, e, column) => {

        if (keyFromDetail === 'LOVSearch') {
            //console.log('LOVSearch');
            this.setState({
                user: {
                    ...this.state.user,
                    [column]: e.target.value
                }
            });
            //console.log(this.state.user, column)
        }

        if (keyFromDetail === 'LOV') {
            //console.log('LOV');

            this.setState({
                user: {
                    ...this.state.user,
                    [column]: e.target.options[e.target.selectedIndex].value
                }
            });
        }

        if (keyFromDetail === 'checkbox') {
            //console.log('checkbox');
            const {name, checked} = e.target;
            this.setState({user: {...this.state.user, [column]: checked}})
        }
    };

    render() {

        let column = Object.keys(this.props.initialFormState);
        //console.log(column)
        if (column && this.props.orderColumnsAdd) {
            //console.log('order active in add')
            column = orderFunction(column, this.props.orderColumnsAdd);
        }
        //console.log(column)
        return (
            <form
                onSubmit={event => {
                    event.preventDefault();
                    let flagRequired = 0;
                    if (this.props.requiredInsert) {
                        flagRequired = controlHeadersForValidateRequired(column, this.props.requiredInsert, this.state.user)
                    }
                    if (flagRequired === 1) {
                        //console.log('Required stars fields...')
                        return;
                    } else {
                        this.controlDatepicker();
                    }
                    this.props.controlPopUp(0);


                    this.props.addUser(this.state.user);

                    this.setState({user: this.props.init});
                }}
            >

                <div className='formAdd'>

                    <Row>

                        <Col xs="12" lg="6">
                            <div id={'rightDIV'}>
                                {this.returnAddForm(1, column)}
                            </div>
                        </Col>
                        <Col xs="12" lg="6">
                            <div id={'leftDIV'}>
                                {this.returnAddForm(0, column)}
                            </div>
                        </Col>
                        <div className={'ButtonForm'}>
                            <button>اضافه کردن
                            </button>
                            <button onClick={this.cancelButton} className="button muted-button">
                                بازگشت
                            </button>
                        </div>
                    </Row>
                </div>


            </form>
        )
    }

    controlDatepicker() {
        /**
         * we check for all columns in DatePicker that come from setting is in addForm
         * if is was so should change value(function) with this method "getCustomFormat" so return string date and we dont need function
         */
        let column = Object.keys(this.props.initialFormState);
        if (this.props.DatePickerColumns) {
            if (this.props.DatePickerColumns.DatePicker === 'DatePicker') {
                for (let l = 0; l < this.props.DatePickerColumns.columns.length; l++) {
                    if (column.includes(this.props.DatePickerColumns.columns[l])) {
                        //console.log(this.props.DatePickerColumns.columns[l]);
                        this.state.user = {
                            ...this.state.user,
                            [this.props.DatePickerColumns.columns[l]]: this.getCustomFormat(this.state.user[this.props.DatePickerColumns.columns[l]], false)
                        }
                    }
                }
            }
        }
    }
}

export default AddUserForm

