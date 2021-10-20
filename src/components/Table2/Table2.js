import React, {Fragment, Component, PureComponent} from 'react'
import AddUserForm from './AddForm/AddUserForm'
import EditUserForm from './EditForm/EditUserForm'
import Form from './Form/Form'
import ShowTable from './ShowTable/ShowTable'
import Loading from './loading/Loading'
import SearchForm from './SearchForm/SearchForm'
import axios from "axios";
import './responsive.css'
import Paging from './Paging/Paging';
import PopUpFixed from './Popup/PopUpFixed'
import {Col, Pagination, Row,} from 'reactstrap';
import AlertDangers from './DangerAlerts/DangerAlerts'

/**
 * version is 12 add style Paging
 * version is 13 add search
 * version is 14 add required with star label in add and eit form(format =====> name of tag + index of columns after order)
 * change css blueSky
 * chang showTableHook to class addForm to class searchForm to class editForm to class
 * clear  ref.setState({currentUser: ref.state.init}); in line 100 Table2
 * version 15 define default for every checkBox and every LOV
 * Version 16 add picker for addForm and editForm and resolve bug =>in checkBox and select and datePicker control columns in setting if user dont fill columns property
 * Version 17 define default datePicker in addForm and editForm
 * Version 18 checkBox in add form update and refresh clear
 * Version 19 add upload components with default img
 * version 20 responsive css add
 * version 21 resolve bug for empty table it was very bad bug
 * version 22 optimize add service and clear bugs in empty table
 * version 23 handle errors that define in server and show message
 * version 24 add search
 * version 25 add paginate for search with flag search
 * version 26 customize components to difrent folder
 * version 27 delete forceUsers from state and optimize paginate and solve bug
 * version 28 add popUp to addForm and editForm => fixed form
 * version 29 add triger for insert,update,delete,search ==> beforeSendTriger
 * version 30 order option add to update add and showTable
 * version 31 add detail form for show details of every row
 * version 32 add required for select and checkBox and resolve bugs
 */

class Table2 extends PureComponent {

    constructor(props) {
        super(props);
    }

    state = {
        handleError: (Array.isArray(this.props.handleError) && this.isRealValue(this.props.handleError)) ? this.props.handleError : [],
        resultCode: (Array.isArray(this.props.resultCode) && this.isRealValue(this.props.resultCode)) ? this.props.resultCode : [],
        resultRes: (Array.isArray(this.props.resultRes) && this.isRealValue(this.props.resultRes)) ? this.props.resultRes : [],
        showDialog: false,
        textDialog: 'لطفا اطلاعات کاربری را به درستی وارد کنید...',
        hiddenSelect: (Array.isArray(this.props.hiddenSelect) && this.isRealValue(this.props.hiddenSelect)) ? this.props.hiddenSelect : [],
        renderUpdate: (Array.isArray(this.props.renderUpdate) && this.isRealValue(this.props.renderUpdate)) ? this.props.renderUpdate : [],
        renderFormDetail: (Array.isArray(this.props.renderFormDetail) && this.isRealValue(this.props.renderFormDetail)) ? this.props.renderFormDetail : [],
        renderInsert: (Array.isArray(this.props.renderInsert) && this.isRealValue(this.props.renderInsert)) ? this.props.renderInsert : [],
        renderSelect: (Array.isArray(this.props.renderSelect) && this.isRealValue(this.props.renderSelect)) ? this.props.renderSelect : [],
        updateTable: true,
        insertTable: true,
        deleteTable: true,
        checkBoxColumns: ((this.isObject(this.props.checkBoxColumns)) && this.isRealValue(this.props.checkBoxColumns)) ? ((this.hasChild(this.props.checkBoxColumns)) ? this.props.checkBoxColumns : {}) : {},
        uploadFileColumns: ((this.isObject(this.props.uploadFileColumns)) && this.isRealValue(this.props.uploadFileColumns)) ? ((this.hasChild(this.props.uploadFileColumns)) ? this.props.uploadFileColumns : {}) : {},
        DatePickerColumns: ((this.isObject(this.props.DatePickerColumns)) && this.isRealValue(this.props.DatePickerColumns)) ? ((this.hasChild(this.props.DatePickerColumns)) ? this.props.DatePickerColumns : {}) : {},
        selectColumns: ((this.isObject(this.props.selectColumns)) && this.isRealValue(this.props.selectColumns)) ? ((this.hasChild(this.props.selectColumns)) ? this.props.selectColumns : {}) : {},
        orderColumnsSelect: ((this.isObject(this.props.orderColumnsSelect)) && this.isRealValue(this.props.orderColumnsSelect)) ? ((this.hasChild(this.props.orderColumnsSelect)) ? this.props.orderColumnsSelect : {}) : {},
        orderColumnsAdd: ((this.isObject(this.props.orderColumnsAdd)) && this.isRealValue(this.props.orderColumnsAdd)) ? ((this.hasChild(this.props.orderColumnsAdd)) ? this.props.orderColumnsAdd : {}) : {},
        headersDesc: this.props.headersDesc ? this.props.headersDesc : {},
        search: 0,
        count_OF_row: 0,
        // dataParamsSelect: {
        //     page: 1,
        //     count: 10,
        // },
        dataParamsSelect: ((this.isObject(this.props.dataParamsSelect)) && this.isRealValue(this.props.dataParamsSelect)) ? ((this.hasChild(this.props.dataParamsSelect)) ? this.props.dataParamsSelect : {}) : {},
        dataParamsCount: this.props.dataParamsCount,
        init: {},
        users: [],
        currentUser: this.props.defaultColumn ? this.props.defaultColumn : {},
        dataParamsSearch: this.props.dataParamsSearch ? this.props.dataParamsSearch : {},
        showPopup: 0,
        forceUsers: 1,
        headers: this.props.headers ? this.props.headers : {},
        editing: false,
        baseURL: this.props.baseURL,
        flagSearch: 0,
        flagPopUpFixed: this.props.flagPopUpFixed ? true : false,
        flagShowDetails: this.props.flagShowDetails ? true : false,
        loading: false
    };


    componentDidMount() {
        this.setState({loading: true})
        //console.log('%c insta:homayoun_alizade', 'color:blue')
        //console.log('%c only god team ===> homayonit88@yahoo.com ', 'color:green')
        {
            const headers = {
                'Content-Type': 'application/json'
            };
            var ref = this;

            if (this.props.path) {

                if (this.props.path.count) {
                    //console.log('count is : ', this.props.baseURL,/* this.props.path.count*/);
                    axios.post(this.props.baseURL + this.props.path.count, this.state.dataParamsCount, {
                        headers: headers
                    })
                        .then(async function (response) {
                            // this.setState({loading: false})
                            let flag = await ref.errorHandleTable(response, ref);

                            if (flag === 1) {

                                if (ref.resultHandleTable(response, ref)) {

                                    if (response.data[ref.state.resultRes[0]] > 0) {
                                        ref.setState({count_OF_row: response.data.result});
                                    } else {
                                        ref.timerDialog('رکوردی یافت نشد');
                                    }
                                }
                            } else {
                                ref.timerDialog('no eroor handle find count')
                            }

                        })
                        .catch(function (error) {
                            // this.setState({loading: false})
                            ref.timerDialog('error in axios' + error)
                        })
                        .finally(function () {
                            // ref.timerDialog('500 Internal Server Error')
                        });
                } else {
                    ref.setState({loading: false})
                }

                //console.log('select is : ', this.props.baseURL, this.props.path.select,/* this.state.dataParamsSelect*/);
                if (this.props.path.select) {
                    axios.post(this.props.baseURL + this.props.path.select, this.state.dataParamsSelect, {
                        headers: headers
                    })
                        .then(async function (response) {
                            ref.setState({loading: false})
                            //console.log('select * ', response.data)
                            let flag = await ref.errorHandleTable(response, ref);

                            if (flag === 1) {
                                if (ref.resultHandleTable(response, ref)) {
                                    if (response.data[ref.state.resultRes[0]]) {
                                        //console.log('first record : ', (response.data[ref.state.resultRes[0]])[0])
                                        if (response.data[ref.state.resultRes[0]].length > 0) {
                                            Object.keys((response.data[ref.state.resultRes[0]])[0]).map((key, index) => {
                                                ref.state.init[key] = '';
                                                ref.state.currentUser[key] = '';
                                                return ''
                                            });

                                            ref.setState({users: response.data.result});
                                        } else {
                                            ref.timerDialog('رکوردی یافت نشد');
                                        }
                                    }

                                }
                            } else {
                                //console.log('no error handle find paging')
                            }

                        })
                        .catch(function (error) {
                            ref.setState({loading: false})
                            ref.timerDialog('error in axios' + error)
                        })
                        .finally(function () {
                            // ref.timerDialog('500 Internal Server Error')
                        });
                } else {
                    ref.setState({loading: false})
                }
            }
        }
    }


    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    /****************************************************************************
     ******************** refreshTable just use in this class *******************
     ****************************************************************************/

    refreshTable = () => {

        // this.setState({forceUsers: 1});

        const headers = {
            'Content-Type': 'application/json'
        };
        const ref = this;

        if (this.state.flagSearch === 0) {

            if (this.props.path) {

                if (this.props.path.count) {

                    axios.post(this.props.baseURL + this.props.path.count, this.state.dataParamsCount, {
                        headers: headers
                    })
                        .then(function (response) {
                            if (response.data.resultCode) {

                                if (response.data.resultCode === '0') {
                                    ref.setState({count_OF_row: response.data.result});

                                } else {
                                    ref.timerDialog('لطفا resultCode 0 را در سرور تعریف کنید')
                                }
                            }
                        })
                        .catch(function (error) {
                            //console.log('axios error')
                        })
                        .finally(function () {

                        });
                }
                //console.log(this.props.path.select, this.state.dataParamsSelect)
                if (this.props.path.select) {
                    axios.post(this.props.baseURL + this.props.path.select, this.state.dataParamsSelect, {
                        headers: headers
                    })
                        .then(function (response) {
                            if (response.data.resultCode === '0') {

                                if (response.data.result.length > 0) {
                                    Object.keys(response.data.result[0]).map((key, index) => {
                                        ref.state.init[key] = '';
                                        ref.state.currentUser[key] = '';
                                        return ''
                                    });
                                    ref.setState({curentUser: ref.state.init});
                                    ref.setState({users: response.data.result});

                                } else {

                                    ref.setState({curentUser: ref.props.defaultColumn});
                                    ref.setState({users: ref.props.defaultColumn});

                                }

                            } else {
                                ref.timerDialog('لطفا resultCode 0 را در سرور تعریف کنید')
                            }
                        })
                        .catch(function (error) {

                            //console.log(error);
                        })
                        .finally(function () {

                        });

                }
            }
        } else {
            //console.log('  before service ', this.state.dataParamsSearch)
            axios.post(this.props.baseURL + this.props.path.search, this.createJson(this.state.curentUserSearch, this.state.dataParamsSearch), {
                headers: headers
            })
                .then(function (response) {

                    if (response.data.resultCode === '0') {
                        //console.log('count is ', response.data.count)

                        if (response.data.result.length > 0) {
                            Object.keys(response.data.result[0]).map((key, index) => {
                                ref.state.init[key] = '';
                                ref.state.currentUser[key] = '';
                                return ''
                            });
                            ref.setState({curentUser: ref.state.init});
                            ref.setState({users: response.data.result});
                            ref.setState({count_OF_row: response.data.count});
                        } else {
                            ref.setState({curentUser: ref.props.defaultColumn});
                            ref.setState({users: ref.props.defaultColumn});
                            ref.setState({count_OF_row: response.data.count});
                        }
                    } else if (response.data.resultCode === '1') {

                    }


                })
                .catch(function (error) {
                    //console.log('bad request in setting');
                    //console.log(error);
                })
                .finally(function () {

                });

        }


    };

    /******************************************************
     ******************** utils library *******************
     ******************************************************/
    /**
     *this method if return 0 => so server is not correct else return 1 =>so server is correct
     */

    beforeRenderTrigerAddForm = (renders, lastChangeinAddForm) => {
        if (this.props.beforeRenderTrigerAddForm) {
            return this.props.beforeRenderTrigerAddForm(renders, lastChangeinAddForm);
        }
        return

    }

    errorHandleTable = (response, ref) => {

        if (Object.keys(response.data).includes(ref.state.resultCode[0])) {
            for (let i = 0; i < ref.state.handleError.length; i++) {

                if (ref.state.handleError[i].code && ref.state.handleError[i].msg && ref.state.handleError[i].success) {
                    if (response.data[ref.state.resultCode[0]] === ref.state.handleError[i].code) {

                        if (ref.state.handleError[i].success === 'true') {
                            return 1;

                        } else {
                            ref.timerDialog(ref.state.handleError[i].msg + ' or success property is not string');
                            return 0;
                        }
                    } else {

                    }
                } else {
                    ref.timerDialog('لطفا مقدار code,msg,success را تعریف کنید => [{code:"",msg:"",success:""}] or property success should be string');
                    return 0;
                }
            }
        } else {
            ref.timerDialog('لطفا مقدار resultCode را تعریف کنید');
            return 0;
        }
        return 0;


    }
    resultHandleTable = (response, ref) => {
        if (Object.keys(response.data).includes(ref.state.resultRes[0])) {
            return true;
        } else {
            ref.timerDialog('لطفا پارامتر خروجی وب سرویس را مشخص کنید(resultRes)')
            return false;
        }
    };

    timerDialog(msgText) {


        this.setState({
            showDialog: true,
            textDialog: msgText
        });
        this.timeout = setTimeout(() => {
            this.setState({
                showDialog: false,

            });
            clearTimeout(this.timeout);
        }, 4000);
    }

    isObject(obj) {
        // //console.log(obj instanceof Object);
        return obj instanceof Object;
    };

    hasChild(obj) {

        return !!Object.keys(obj).length;
    }

    isRealValue(obj) {
        // //console.log('real ',obj && obj !== 'null' && obj !== 'undefined') ;
        return obj && obj !== 'null' && obj !== 'undefined';
    }

    createJson(currentRow, curentDataParamCrud) {

        if (!this.isRealValue(curentDataParamCrud)) {
            return {}
        }

        if (!this.hasChild(curentDataParamCrud)) {
            return {}
        }
        const new_obj = {};
        Object.keys(curentDataParamCrud).map((key, index) => {
            /**
             * if insert param === column of table save in new_obj else it is not
             * column so it is extra insert param like token
             */
            // //console.log('every param', typeof currentRow[curentDataParamCrud[key]], currentRow[curentDataParamCrud[key]], key)
            if (currentRow[curentDataParamCrud[key]] === 'null' || typeof currentRow[curentDataParamCrud[key]] === 'undefined') {
                new_obj[key] = curentDataParamCrud[key];
            } else {
                new_obj[key] = currentRow[curentDataParamCrud[key]];
            }
            return ''
        });
        //console.log('send param ', new_obj);
        if (this.props.beforeSendTrigerInsert) {

            if (this.props.beforeSendTrigerInsert(new_obj) && this.isObject(this.props.beforeSendTrigerInsert(new_obj)) && this.isRealValue(this.props.beforeSendTrigerInsert(new_obj))) {
                //console.log('trigger insert executed add...', this.props.beforeSendTrigerInsert(new_obj))
                return this.props.beforeSendTrigerInsert(new_obj);
            } else {
                this.timerDialog('triger is not correct. please check your triger...')
            }


        }
        if (this.props.beforeSendTrigerUpdate) {

            if (this.props.beforeSendTrigerUpdate(new_obj) && this.isObject(this.props.beforeSendTrigerUpdate(new_obj)) && this.isRealValue(this.props.beforeSendTrigerUpdate(new_obj))) {
                //console.log('trigger update executed update...', this.props.beforeSendTrigerUpdate(new_obj))
                return this.props.beforeSendTrigerUpdate(new_obj);
            } else {
                this.timerDialog('triger is not correct. please check your triger...')
            }


        }
        if (this.props.beforeSendTrigerDelete) {

            if (this.props.beforeSendTrigerDelete(new_obj) && this.isObject(this.props.beforeSendTrigerDelete(new_obj)) && this.isRealValue(this.props.beforeSendTrigerDelete(new_obj))) {
                //console.log('trigger delete executed add...', this.props.beforeSendTrigerDelete(new_obj))
                return this.props.beforeSendTrigerDelete(new_obj);
            } else {
                this.timerDialog('triger is not correct. please check your triger...')
            }


        }
        if (this.props.beforeSendTrigerSearch) {

            if (this.props.beforeSendTrigerSearch(new_obj) && this.isObject(this.props.beforeSendTrigerSearch(new_obj)) && this.isRealValue(this.props.beforeSendTrigerSearch(new_obj))) {
                //console.log('trigger search executed add...', this.props.beforeSendTrigerSearch(new_obj))
                return this.props.beforeSendTrigerSearch(new_obj);
            } else {
                this.timerDialog('triger is not correct. please check your triger...')
            }


        }
        return new_obj;
    }

    addSearch = user => {
        this.setState({loading: true})
        let ref = this;

        const headers = {
            'Content-Type': 'application/json'
        };

        if (true) {

            /**************************************************
             *********************** search  ******************
             **************************************************/
                //
            let newdataParamsSearch = Object.assign({}, this.state.dataParamsSearch);
            newdataParamsSearch.page = 1;
            //console.log('search', this.props.baseURL + this.props.path.search, newdataParamsSearch)
            axios.post(this.props.baseURL + this.props.path.search, this.createJson(user, newdataParamsSearch), {
                headers: headers
            })
                .then(function (response) {
                    ref.setState({loading: false})
                    if (response.data.resultCode === '0') {


                        if (response.data.result.length > 0) {
                            Object.keys(response.data.result[0]).map((key, index) => {
                                ref.state.init[key] = '';
                                ref.state.currentUser[key] = '';
                                return ''
                            });
                            ref.setState({curentUser: ref.state.init});
                            ref.setState({users: response.data.result});
                            ref.setState({count_OF_row: response.data.count});
                        } else {
                            ref.setState({curentUser: ref.props.defaultColumn});
                            ref.setState({users: ref.props.defaultColumn});
                            ref.setState({count_OF_row: response.data.count});
                        }
                    } else if (response.data.resultCode === '1') {

                    }


                })
                .catch(function (error) {
                    ref.setState({loading: false})
                    //console.log('bad request in setting');
                    //console.log(error);
                })
                .finally(function () {

                });

        }


        this.setState({curentUserSearch: user})
        this.setState({flagSearch: 1});

    };
    /***********************************************
     *************  CRUD operations ****************
     */

    addUser = user => {

        this.setState({loading: true});

        const headers = {
            'Content-Type': 'application/json'
        };
        //console.log(this.props.baseURL, this.props.path.insert);

        /**************************************************
         ******************* add service  *****************
         **************************************************/
        var ref = this;
        if (this.props.path) {

            axios.post(this.props.baseURL + this.props.path.insert, this.createJson(user, this.props.dataParamsInsert), {
                headers: headers
            })
                .then(function (response) {
                    ref.setState({loading: false});
                    //console.log('response add api', response.data);
                    if (response.data.resultCode === '0') {
                        if (ref.state.users > 0) {

                            user[Object.keys(ref.state.users[0])[0]] = ref.state.users.length + 1;
                            ref.setState({users: [...ref.state.users, user]});
                            for (let i = 0; i < ref.state.users.length; i++) {
                                ref.state.users[i][Object.keys(ref.state.users[0])[0]] = i + 1;
                            }

                        } else {
                            ref.setState({users: user});
                        }
                        ref.refreshTable();
                    } else if (response.data.resultCode === '1') {

                        ref.timerDialog('عملیات سرور ناموفق دوباره تلاش کنید')

                    } else if (response.data.resultCode === '20') {
                        if (response.data.Data) {
                            ref.timerDialog(response.data.Data);
                        }

                    } else if (response.data.resultCode === "10") {
                        if (response.data.Data) {
                            if (response.data.Data[0].msg) {
                                ref.timerDialog(response.data.Data[0].msg)
                            }
                        }

                    } else {
                        ref.timerDialog('لطفا resultCode 0 را در سرور تعریف کنید')
                    }
                })
                .catch(function (error) {
                    ref.setState({loading: false});
                    //console.log('bad request', error);
                })
                .finally(function () {
                });
        }


    };
    /**************************************************
     ***************** delete service  ****************
     **************************************************/
    deleteUser = deleteUser => {
        this.setState({loading: true})

        var ref = this;
        const headers = {
            'Content-Type': 'application/json'
        };
        axios.post(this.props.baseURL + this.props.path.delete, this.createJson(deleteUser, this.props.dataParamsDelete)
            , {
                headers: headers
            })
            .then(function (response) {
                ref.setState({loading: false})
                //console.log('delete response', response.data)
                if (response.data.resultCode === '0') {
                    ref.setState({editing: false});
                    ref.setState({users: ref.state.users.filter(user => user[Object.keys(user)[0]] !== deleteUser.id)});
                    ref.refreshTable();
                } else if (response.data.resultCode === '1') {

                }
            })
            .catch(function (error) {
                ref.setState({loading: false})
                //console.log('bad request in setting');
                //console.log(error);
            })
            .finally(function () {

            });

    };
    /**************************************************
     ***************** edit service  ****************
     **************************************************/
    updateUser = (id, updatedUser) => {
        // //console.log('result', updatedUser, this.props.baseURL + this.props.path.update)
        this.setState({loading: true})
        const headers = {
            'Content-Type': 'application/json'
        };
        var ref = this;
        axios.post(this.props.baseURL + this.props.path.update, this.createJson(updatedUser, this.props.dataParamsUpdate)
            , {
                headers: headers
            })
            .then(function (response) {
                ref.setState({loading: false})
                // //console.log(response.data)
                if (response.data.resultCode === '0') {
                    ref.setState({showPopup: 0});
                    ref.setState({editing: false});
                    ref.setState({users: ref.state.users.map(user => (user[Object.keys(user)[0]] === id ? updatedUser : user))});
                    ref.setState({currentUser: ref.state.init});
                    ref.refreshTable();
                } else if (response.data.resultCode === '1') {

                } else if (response.data.resultCode === '10') {
                    if (response.data.Data) {
                        if (response.data.Data[0].msg) {
                            ref.timerDialog(response.data.Data[0].msg)
                        }
                    }

                } else if (response.data.resultCode === '20') {
                    if (response.data.Data) {

                        ref.timerDialog(response.data.Data)

                    }
                }
            })
            .catch(function (error) {
                ref.setState({loading: false})
                ref.timerDialog('axios error')

            })
            .finally(function () {

            });


    };
    editRow = user => {


        this.setState({showPopup: 1});
        this.setState({editing: true});
        /**
         *  sample => setCurrentUser({ID: user.ID, NAME: user.NAME, DESCRIPTION: user.DESCRIPTION})
         *  const test={}
         *  Object.keys(currentUser).map((key,index)=>{//console.log(test[`${key}`]=user[`${key}`])});
         */
        this.setState({currentUser: user});
    };
    controlPopUp = (showValue) => {
        /**
         * value 3,4 is for search
         * value 2 is for add
         */
        if (showValue === 3) {
            this.setState({search: 1})

        }
        if (showValue === 4) {
            this.setState({search: 0})
        }

        if (showValue === 2) {
            //console.log('add');

            // //console.log('table is : ' , this);
            this.setState({showPopup: 1});
            this.setState({editing: false});

            /**
             * init always is default row of table all property is ''
             */

            (Object.keys(this.state.currentUser).map((key, index) => {
                // setCurrentUser({});
                this.state.currentUser[key] = '';
                return null
            }));

            this.refreshTable();
        } else {
            //TODO:check show value and define if no else
            this.setState({showPopup: showValue})
        }
    };
    /**************************************************************************************************
     **************************************** function for pagging ************************************
     **************************************************************************************************/
    showDetails = (user) => {
        this.setState({currentUser: user});
        this.setState({flagShowDetails: true})

    };
    cancelDetails = (user) => {
        // this.setState({currentUser: user});
        this.setState({flagShowDetails: false})

    };
    handlePageClick = (e, page) => {
        e.preventDefault();
        // //console.log('%c function Table2', 'color: blue');
        this.state.dataParamsSelect = {...this.state.dataParamsSelect, page: page};
        this.state.dataParamsSearch = {...this.state.dataParamsSearch, page: page};
        this.refreshTable();
        // this.setState({dataParamsSelect: {...this.state.dataParamsSelect, page: page}});
        // this.setState({dataParamsSearch: {...this.state.dataParamsSearch, page: page}});
        // this.setState({forceUsers: 0});
    };

    closePopupFixed = () => {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }
    closePopupFixedShowDetails = () => {
        this.setState({
            flagShowDetails: !this.state.flagShowDetails
        });
    }
    orderColumnsForm;
    orderColumnsEdit;
    requiredUpdate;
    renderDetailShow;
    requiredInsert;

    /*****************************************************
     ***************** return components *****************
     */
    render() {
        // //console.log('%c render Table2', 'color: green');
        return (
            <div className="container"
                 style={{marginTop: '25px', padding: '10px', direction: 'rtl', border: 'none', background: 'none'}}>
                {this.state.loading ? <Loading/> : null}

                <div>
                    <Row className="justify-content-center">
                        <Col md="8" style={{textAlign: 'center'}}>

                            {this.state.showDialog ? <AlertDangers textDialog={this.state.textDialog}/> : null}
                        </Col>

                    </Row>
                </div>
                <div id={'CRUD'} className="flex-row" style={{margin: 'auto', textAlign: 'right', width: '100%'}}>
                    <div className="flex-large">
                        {this.state.search === 1 ? (<Fragment>
                            <h2>جستجو</h2>
                            <SearchForm
                                selectColumns={((this.isObject(this.props.selectColumns)) && this.isRealValue(this.props.selectColumns)) ? ((this.hasChild(this.props.selectColumns)) ? this.props.selectColumns : {}) : {}}
                                checkBoxColumns={this.state.checkBoxColumns}
                                headersDesc={this.state.headersDesc}
                                renderInsert={this.state.renderInsert}
                                addSearch={this.addSearch} users={this.state.users}
                                initialFormState={this.state.currentUser}
                                init={this.state.init}
                                controlPopUp={this.controlPopUp}/>
                        </Fragment>) : null}
                        {this.state.showPopup === 1 ? ((this.state.editing) ? (
                            <Fragment>
                                <h2>{this.state.headers.headerEditForm}</h2>
                                {/*{//console.log('c% curentUser',this.state.currentUser,'color:red')}*/}
                                <EditUserForm orderColumnsEdit={this.props.orderColumnsEdit}
                                              DatePickerColumns={this.state.DatePickerColumns}
                                              requiredUpdate={this.props.requiredUpdate}
                                              headersDesc={this.state.headersDesc}
                                              renderUpdate={this.state.renderUpdate}
                                              editing={this.state.editing}
                                    // setEditing={setEditing}
                                              currentUser={this.state.currentUser}
                                              updateUser={this.updateUser}
                                              controlPopUp={this.controlPopUp}
                                              init={this.state.init}
                                              selectColumns={((this.isObject(this.props.selectColumns)) && this.isRealValue(this.props.selectColumns)) ? ((this.hasChild(this.props.selectColumns)) ? this.props.selectColumns : {}) : {}}
                                              checkBoxColumns={this.state.checkBoxColumns}
                                              uploadFileColumns={this.state.uploadFileColumns}
                                              baseURL={this.props.baseURL}

                                />
                            </Fragment>
                        ) : (
                            <Fragment>
                                <h2>{this.state.headers.headerAddForm}</h2>

                                {this.state.flagPopUpFixed === true ?
                                    <PopUpFixed closePopup={this.closePopupFixed}
                                                text={this.state.headers.headerAddForm}>
                                        <AddUserForm orderColumnsAdd={this.state.orderColumnsAdd}
                                                     baseURL={this.props.baseURL}
                                                     beforeRenderTrigerAddForm={this.beforeRenderTrigerAddForm}
                                                     DatePickerColumns={this.state.DatePickerColumns}
                                                     requiredInsert={this.props.requiredInsert}
                                                     selectColumns={((this.isObject(this.props.selectColumns)) && this.isRealValue(this.props.selectColumns)) ? ((this.hasChild(this.props.selectColumns)) ? this.props.selectColumns : {}) : {}}
                                                     checkBoxColumns={this.state.checkBoxColumns}
                                                     headersDesc={this.state.headersDesc}
                                                     renderInsert={this.state.renderInsert}
                                                     addUser={this.state.insertTable ? this.addUser : () => {
                                                     }} users={this.state.users}
                                                     initialFormState={this.state.currentUser}
                                                     init={this.state.init}
                                                     uploadFileColumns={this.state.uploadFileColumns}
                                                     controlPopUp={this.controlPopUp}/>
                                    </PopUpFixed>
                                    :
                                    <AddUserForm orderColumnsAdd={this.state.orderColumnsAdd}
                                                 beforeRenderTrigerAddForm={this.beforeRenderTrigerAddForm}
                                                 DatePickerColumns={this.state.DatePickerColumns}
                                                 requiredInsert={this.props.requiredInsert}
                                                 selectColumns={((this.isObject(this.props.selectColumns)) && this.isRealValue(this.props.selectColumns)) ? ((this.hasChild(this.props.selectColumns)) ? this.props.selectColumns : {}) : {}}
                                                 checkBoxColumns={this.state.checkBoxColumns}
                                                 headersDesc={this.state.headersDesc}
                                                 renderInsert={this.state.renderInsert}
                                                 addUser={this.state.insertTable ? this.addUser : () => {
                                                 }} users={this.state.users} initialFormState={this.state.currentUser}
                                                 init={this.state.init}
                                                 uploadFileColumns={this.state.uploadFileColumns}
                                                 controlPopUp={this.controlPopUp}/>
                                }

                            </Fragment>
                        )) : ''}
                    </div>
                    <hr/>
                    <div className="flex-large">
                        <h2>{this.state.headers.headerShowTable}</h2>
                        {this.props.renderMenu ? <div className='menu'>
                            <button onClick={() => {
                                this.controlPopUp(2)
                            }}><i
                                className="icon-plus icons font-sm  mt-sm-1"></i> {` ایجاد  ${this.state.headers.headerShowTable}  `}
                            </button>
                            <button onClick={() => {
                                this.controlPopUp(3)
                            }}><i className="icon-magnifier  icons font-sm  mt-sm-1"></i> {` جستجو  `}
                            </button>

                        </div> : null}

                        <ShowTable showDetails={this.showDetails} renderDetailShow={this.props.renderDetailShow}
                                   orderColumnsSelect={this.state.orderColumnsSelect}
                                   renderAction={this.props.renderAction}
                                   page={this.state.dataParamsSelect.page}
                                   count={this.state.dataParamsSelect.count}
                                   hiddenSelect={this.state.hiddenSelect}
                                   renderSelect={this.state.renderSelect}
                                   headersDesc={this.state.headersDesc} users={this.state.users}
                                   editRow={this.state.updateTable ? this.editRow : () => {
                                   }} deleteUser={this.state.deleteTable ? this.deleteUser : () => {
                        }} controlPopUp={this.controlPopUp} checkBoxColumns={this.state.checkBoxColumns}
                                   detail={this.props.detail}/>

                        <div id={'pagingReact'}>
                            <Pagination style={{paddingInlineStart: '0px', marginTop: '5px'}}>
                                <div style={{padding: '3px'}}>
                                    <Paging dataParamsSelect={this.state.dataParamsSelect}
                                            count_OF_row={this.state.count_OF_row}
                                            handlePageClick={this.handlePageClick}/>
                                </div>
                            </Pagination>


                            {this.state.flagShowDetails === true ?
                                <PopUpFixed closePopup={this.closePopupFixedShowDetails}
                                            text={'جزییات'}>
                                    <Form orderColumnsForm={this.props.orderColumnsForm}
                                          cancelDetails={this.cancelDetails}
                                          DatePickerColumns={this.state.DatePickerColumns}
                                          headersDesc={this.state.headersDesc}
                                          renderFormDetail={this.state.renderFormDetail}
                                          currentUser={this.state.currentUser}
                                          init={this.state.init}
                                          selectColumns={((this.isObject(this.props.selectColumns)) && this.isRealValue(this.props.selectColumns)) ? ((this.hasChild(this.props.selectColumns)) ? this.props.selectColumns : {}) : {}}
                                          checkBoxColumns={this.state.checkBoxColumns}
                                          uploadFileColumns={this.state.uploadFileColumns}
                                          baseURL={this.props.baseURL}
                                    />
                                </PopUpFixed>
                                : null
                            }


                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
;

export default Table2
