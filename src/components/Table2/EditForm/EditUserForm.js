import React, {PureComponent} from 'react'
import './EditUserForm.css'
import {Col, Row} from "reactstrap";
import DatePicker from "react-datepicker2";
import moment from "moment-jalaali";
import logo from "../../../../assets/img/brand/logo.svg";
import {
    controlHeaders,
    controlHeadersForValidateRequired,
    controlTypeColumnsComponent,
    isFunction,
    isRealValue,
    orderFunction
} from './../utils/utils'
import axios from "axios";
import TableLOV from "./../TableLOV/TableLOV";
import CheckBox from "./../CheckBox/CheckBox";

class EditUserForm extends PureComponent {

    constructor(props) {
        super(props);
    }

    state = {
        base64: logo,
        user: this.props.currentUser,
        checkBox: false,
        isGregorian: true
    };
    uploadFile;


    componentDidMount() {
        this.setState({user: this.props.currentUser});
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
                                // //console.log('LOV SERVICE : ', this.props.baseURL + path);
                                axios.post(this.props.baseURL + path, {token}, {
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
        if (event.target.type === 'checkbox') {

            this.setState({checkBox: !event.target.defaultChecked});

            const {name, checked} = event.target;
            //console.log(event.target.checked, this.state.user);
            this.setState({user: {...this.state.user, [name]: checked}})

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
    renderEdit;
    editForm = (g, column) => {
        let flagbeforeRenderTrigerEditForm = false;
        let specialComponentEveryRow = controlTypeColumnsComponent(this.props.checkBoxColumns, this.props.uploadFileColumns, this.props.selectColumns, this.props.DatePickerColumns);


        /**********************************************
         ***** newRender if there is triger for it ****
         **********************************************/
        let newRender = [];
        if (this.props.beforeRenderTrigerEditForm) {


            newRender = this.props.beforeRenderTrigerEditForm(this.props.renderEdit, this.state.user);
            // if (newRender && Array.isArray(newRender) && this.isRealValue(newRender)) {
            if (newRender && Array.isArray(newRender) && isRealValue(newRender)) {
                flagbeforeRenderTrigerEditForm = true;
            } else {
                flagbeforeRenderTrigerEditForm = false
            }

        }
        return (
            column.map((key, index) => {
                if ((index + 1) % 2 === g) {

                    if (flagbeforeRenderTrigerEditForm) {

                        // let newRender = this.props.beforeRenderTrigerAddForm(this.props.renderInsert, this.state.user)
                        if (newRender) {
                            //console.log(' beforeRenderTrigerEditForm is executed');
                            if (newRender.includes(key)) {
                                return null;
                            }
                        }

                    } else if (this.props.renderUpdate) {
                        if (this.props.renderUpdate.includes(key)) {
                            return null;
                        }
                    }

                    /**
                     * z = every special components = @specialComponent EveryRow is all specials components with columnsName that have this  like [{checkBox: "checkBox", columns: Array(1)}]
                     *  is work just for special col of row table
                     */
                    for (let z = 0; z < specialComponentEveryRow.length; z++) {
                        // //console.log('row ', i, ' column ', h, array_of_columns[h], ' spec ', z, specialComponentEveryRow[z].columns);

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
                                                 * selectOptions is one row of path that path is set in setting => path in setting is array that
                                                 * every row in path is => one list of value = one (LOV)
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

                    switch (switchComponents) {
                        case "checkBox":
                            this.state[key] = (this.state.user[column[index]] != null ? this.state.user[column[index]] : false);
                            return <div key={index}>
                                {controlHeaders(key, index, '', this.props.headersDesc, this.props.requiredUpdate)}

                                <CheckBox
                                    pk={`select${index}`}
                                    FromDetailForAddUserForm={this.FromDetailForAddUserForm}
                                    idColumn={column[index]}
                                    indexColumn={index}
                                    checked={this.state[key]}
                                    columnName={key}/>
                            </div>;
                        case "uploadFile":

                            this.state[key] = (this.state.user[column[index]] != null ? this.props.baseURL + this.state.user[column[index]] : 'logo');

                            return <div key={index}>

                                {controlHeaders(key, index, '', this.props.headersDesc, this.props.requiredUpdate)}

                                <input id={`input${column[index]}`}
                                       key={'input' + index}
                                       type="file"
                                       name={key}

                                    //TODO:call with keys =>checkBox[key]
                                       onChange={this.handleInputChange}/>
                                <img style={{width: '30px', height: '30px'}} src={this.state[key]}/>
                            </div>;
                        case 'select':
                            return <div key={index}>
                                {controlHeaders(key, index, '', this.props.headersDesc, this.props.requiredUpdate)}
                                <TableLOV pk={`select${index}`} type={type} search={search}
                                          FromDetailForAddUserForm={this.FromDetailForAddUserForm}
                                          orgKey={key}
                                          selected={(this.state.user[key] != null ? this.state.user[key] : "")}
                                          orgIndex={index} selectOptions={selectOptions}/>
                            </div>;
                        case 'DatePicker':
                            return <div style={{position: 'relative'}} key={index}>

                                {controlHeaders(key, index, 'DatePicker', this.props.headersDesc, this.props.requiredUpdate)}

                                <DatePicker
                                    timePicker={false}
                                    // value={this.state.value}
                                    // value={this.isFunction(this.state.user[key]) ? this.state.user[key] : (moment(this.state.user[key], 'jYYYY/jM/jD').isValid() ? moment(this.state.user[key], 'jYYYY/jM/jD') : moment())}
                                    value={isFunction(this.state.user[key]) ? this.state.user[key] : (moment(this.state.user[key], 'jYYYY/jM/jD').isValid() ? moment(this.state.user[key], 'jYYYY/jM/jD') : moment())}
                                    isGregorian={!this.state.isGregorian}
                                    onChange={value => this.setState({user: {...this.state.user, [key]: value}})}

                                />
                                <input style={{position: 'absolute', top: 0, right: '270px'}} disabled={true}
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
                                {controlHeaders(key, index, '', this.props.headersDesc, this.props.requiredUpdate)}

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
        )
    };


    cancelButton = () => {
        this.props.controlPopUp(0);
        if (this.props.init) {
            // //console.log(props.init)
            this.setState({user: this.props.init})
        }
    };

    /**
     * this function check special components like checkBox,radioButton,select,...
     * if we have every of this components make special array => [{checkBox: "checkBox", columns: Array(1)}]
     * that first home of every object is name of components that we use it
     * and pass to the  RowValues(foreach for table is every Row)   *
     */

    FromDetailForAddUserForm = (keyFromDetail, e, column) => {

        if (keyFromDetail === 'LOVSearch') {
            //console.log('LOVSearch');
            this.setState({
                user: {
                    ...this.state.user,
                    [column]: e.target.value
                }
            });

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

    //TODO:this should be normalize becouse id is static and we change
    //TODO: it with PK and maybe PK is not id
    static getDerivedStateFromProps(nextProps, prevState) {

        if (prevState.user.ID && nextProps.currentUser.ID) {
            if (prevState.user.ID !== nextProps.currentUser.ID) {
                return {
                    user: nextProps.currentUser,
                    // checkBox:nextProps.currentUser.enable
                };
            } else {
                return null
            }
        } else {
            return null
        }
    }

    render() {
        let column = Object.keys(this.props.currentUser);
        //console.log(column)
        if (column && this.props.orderColumnsEdit) {
            //console.log('order active in edit')
            column = orderFunction(column, this.props.orderColumnsEdit);
        }
        //console.log(column)
        return (
            <form
                onSubmit={event => {

                    event.preventDefault();

                    let flagRequired = 0;

                    if (this.props.requiredUpdate) {
                        flagRequired = controlHeadersForValidateRequired(column, this.props.requiredUpdate, this.state.user)
                    }
                    if (flagRequired === 1) {
                        //console.log('Required stars fields...');
                        return;
                    } else {
                        this.controlDatepicker();
                    }
                    this.props.updateUser(this.state.user[column[0]], this.state.user)
                }}
            >

                <div className='formAdd'>
                    <Row>
                        {/*</div>*/}
                        <Col xs="12" lg="6">
                            <div id={'rightDIV'}>
                                {/*{ //console.log('%c render', 'color:red',this.state.checkBox)}*/}
                                {this.editForm(1, column)}
                            </div>
                        </Col>
                        <Col xs="12" lg="6">
                            <div id={'leftDIV'}>
                                {this.editForm(0, column)}
                            </div>
                        </Col>
                        <div className={'ButtonForm'}>
                            <button>بروزرسانی</button>
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
        let column = Object.keys(this.props.currentUser);
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

export default EditUserForm
