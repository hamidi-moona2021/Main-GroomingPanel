import React, {PureComponent} from 'react'
import './../UserTable.css';

import Popup from './../Popup/PopUp';
import './ShowTable.css'
import {controlTypeColumnsComponent, orderFunction} from './../utils/utils'


class ShowTable extends PureComponent {

  constructor(props) {
    super(props);

  }

  state = {
    showPopup: false,
    showRowID: false
  };


  onClickHandler = (event) => {

    if (event.target.tagName) {
      if (event.target.tagName === "I") {
        if (event.target.parentNode) {
          if (event.target.parentNode.parentNode) {
            console.log('this is ICON', event.target.parentNode.parentNode.parentNode)
          }
        }
      }
      if (event.target.tagName === "BUTTON") {
        if (event.target.parentNode) {
          if (event.target.parentNode.parentNode) {
            console.log('this is BUTTON', event.target.parentNode.parentNode)
          }
        }
      }
      if (event.target.tagName === "TD") {
        if (event.target.parentNode) {
          console.log('this is TD', event.target.parentNode)
          if (this.props.detail) {
            this.props.detail();
          }

        }
      }
    }


  };
  /***************************************************
   ****************** action popup *******************
   ***************************************************/
  actionDelete = (i) => {
    // console.log(i);
    this.setState({showPopup: true});
    this.setState({showRowID: i});
    // console.log('showPopup ',showPopup);
    // props.deleteUser(props.users[i]);
  };

  togglePopup = () => {
    this.setState({showPopup: false});
  };
  deletePopup = () => {
    this.props.deleteUser(this.props.users[this.state.showRowID]);
    this.setState({showPopup: false});
  };
  /**********************************************************************
   ****************** actions of return of components *******************
   **********************************************************************/

  renderAction;
  headerTable = (array_of_columns) => {
    const colHeader = [];
    /************************************
     ***this is radif and is isolation***
     ************************************/
    if (this.props.count && this.props.page) {
      colHeader.push(<th className='radif' key={'radifHeader'}>ردیف</th>);
    } else {
      colHeader.push(<th className='radif' key={'radifHeader'}>ردیف</th>);
    }

    if (this.props.users) {
      if (this.props.users.length > 0) {
        var countOfCol = Object.keys(this.props.users[0]).length;


        // let array_of_columns = Object.keys(this.props.users[0]);
        // if (this.props.orderColumnsSelect) {
        //   array_of_columns = orderFunction(array_of_columns, this.props.orderColumnsSelect);
        // }

        for (let h = 0; h < countOfCol; h++) {
          /**
           * this render columns that every render array(setting) includes every column so be render
           */
          if (this.props.renderSelect.includes(array_of_columns[h])) {
            continue;
          }
          if ((Object.keys(this.props.headersDesc)).includes(array_of_columns[h])) {
            colHeader.push(<th
              hidden={this.props.hiddenSelect.includes(array_of_columns[h])}
              key={h}>{this.props.headersDesc[array_of_columns[h]]}</th>)
          } else {
            colHeader.push(<th
              hidden={this.props.hiddenSelect.includes(array_of_columns[h])}
              key={h}>{array_of_columns[h]}</th>)

          }
        }
        if (this.props.renderAction) {
          colHeader.push(<th key={countOfCol}>عملیات</th>);
        }
        if (this.props.renderDetailShow) {
          colHeader.push(<th key={countOfCol + 1}>جزییات</th>);
        }
      }
    }
    return colHeader;
  };

  rowValues = (i, array_of_columns, specialComponentEveryRow) => {

    const rowValue = [];
    if (this.props.users.length > 0) {
      var countOfCol = array_of_columns.length;
      /***********************************
       ** this is radif and is isolation**
       ***********************************/
      if (this.props.page && this.props.count) {
        // console.log('radif',(((props.page)-1)*props.count)+i+1);
        rowValue.push(<td className='radif'
                          key={'radif'}>{(((this.props.page) - 1) * this.props.count) + i + 1}</td>);
      } else {
        rowValue.push(<td className='radif' key={'radif'}>{i + 1}</td>);
      }

      for (let h = 0; h < countOfCol; h++) {
        // console.log(array_of_columns[h], 'key')
        /**
         * this render columns that every render array(setting) includes every column so be render
         */
        if (this.props.renderSelect.includes(array_of_columns[h])) {
          continue;
        }

        /**
         * z=specialComponentEveryRow is all specials components with columns that have this  like [{checkBox: "checkBox", columns: Array(1)}]
         *  is work just for special col of row table
         *
         */
        for (let z = 0; z < specialComponentEveryRow.length; z++) {
          // console.log('row ', i, ' column ', h, array_of_columns[h], ' spec ', z, specialComponentEveryRow[z].columns);
          /**
           * if every columns(is property => is array of columns with specials components)
           * of every  row of specialComponentEveryRow equal with every column of row of table
           * return the first home of object that =>is name of components that pass it to switch
           */
          if (specialComponentEveryRow[z].columns) {
            if (specialComponentEveryRow[z].columns.includes(array_of_columns[h])) {
              var switchComponents = (Object.keys(specialComponentEveryRow[z]))[0];
            }
          }
        }

        switch (switchComponents) {
          case "checkBox" :
            rowValue.push(<td hidden={this.props.hiddenSelect.includes(array_of_columns[h])}
                              key={h}> {this.props.users[i][(array_of_columns[h])] === 1 || this.props.users[i][(array_of_columns[h])] === true ? 'فعال' : 'غیر فعال'}</td>);
            switchComponents = '';
            break;
          case 1:

            break;

          default:
            // {console.log(this.props.users[0][(array_of_columns[h])])}
            rowValue.push(<td hidden={this.props.hiddenSelect.includes(array_of_columns[h])}
                              key={h}> {this.props.users[i][(array_of_columns[h])] !== null ? this.props.users[i][(array_of_columns[h])] : 'no value'}</td>);
        }

      }
      if (this.props.renderAction) {
        rowValue.push(<td key={'action'}>
          <button
            onClick={() => {
              this.props.editRow(this.props.users[i]);
            }}
            className="button muted-button buttonShowTable"
          >
            ویرایش
          </button>
          <button
            onClick={() => this.actionDelete(i)}
            className="button muted-button buttonShowTable"
          >
            حذف
          </button>

        </td>);
      }
      if (this.props.renderDetailShow) {
        rowValue.push(<td key={'Details'}>

          <button
            onClick={() => this.props.showDetails((this.props.users[i]))}
            className="button muted-button buttonShowTable"
          >
            نمایش جزییات
          </button>

        </td>);
      }

    } else {
    }

    return rowValue;
  };
  bodyTable = (array_of_columns) => {

    // let specialComponentEveryRow = this.controlTypeColumnsComponent();
    let specialComponentEveryRow = controlTypeColumnsComponent(this.props.checkBoxColumns);

    const row = [];


    if (this.props.users.length > 0) {
      var countOfRow = this.props.users.length;

      for (let i = 0; i < countOfRow; i++) {
        row.push(<tr onClick={this.onClickHandler} key={i}>

          {this.rowValues(i, array_of_columns, specialComponentEveryRow)}
        </tr>)
      }
    } else {
    }
    return row;
  };

  /*********************************************
   ****************** return *******************
   *********************************************/
  render() {
    let array_of_columns = [];
    if (this.props.users.length > 0) {
      array_of_columns = Object.keys(this.props.users[0]);
      if (this.props.orderColumnsSelect) {
        array_of_columns = orderFunction(array_of_columns, this.props.orderColumnsSelect);
      }
    }
    var countUsers = 0;
    if (this.props.users) {
      countUsers = this.props.users.length;
    }

    return (

      <div>
        <div>
          {this.state.showPopup ?
            <Popup
              orgWidth={'50%'}
              orgHeight={'50%'}
              text='ایا از حذف رکورد مورد نظر اطمینان دارید؟'
              closePopup={() => this.togglePopup()}
              deletePopup={() => this.deletePopup()}>
              {/*<div>test</div>*/}
            </Popup>
            : null
          }
        </div>
        <div style={{overflow: 'auto'}}>


          <table>
            <thead>
            {countUsers > 0 ? <tr style={{textAlign: 'center'}}>
              {this.headerTable(array_of_columns)}
            </tr> : <tr>
              <td colSpan={3}>no headers</td>
            </tr>}

            </thead>
            <tbody>

            {countUsers > 0 ? this.bodyTable(array_of_columns) : (
              <tr>
                <td colSpan={3}>No users</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>

    )
  }
};
export default ShowTable
