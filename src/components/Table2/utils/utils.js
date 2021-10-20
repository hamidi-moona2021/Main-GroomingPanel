import React from 'react';

export function isRealValue(obj) {
  return obj && obj !== 'null' && obj !== 'undefined';
}


export function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Object]';
}

export function isObject(obj) {
  return obj instanceof Object;
};


export function orderFunction(array_of_columns, orderColumnAdd) {

  /*********
   * order *
   *********/
  let orderColumns = orderColumnAdd;
  let orderKeys = Object.keys(orderColumns);
  orderKeys.map((keyOrder, indexOrder) => {
    if (array_of_columns.includes(keyOrder)) {

      let indexColumn = array_of_columns.indexOf(keyOrder);
      if (indexColumn === orderColumns[keyOrder]) {
        return null;
      } else {
        let temp = array_of_columns[orderColumns[keyOrder]];
        array_of_columns[orderColumns[keyOrder]] = array_of_columns[indexColumn];
        // console.log('test', array_of_columns)
        array_of_columns[indexColumn] = temp;
        // console.log('test1', array_of_columns)
      }
    }
  });

  return array_of_columns;
};

/**
 * this function check special components like checkBox,radioButton,select,...
 * if we have every of this components make special array => [{checkBox: "checkBox", columns: Array(1)}]
 * that first home of every object is name of components that we use it
 * and pass to the  RowValues(foreach for table is every Row)   *
 */
export function controlTypeColumnsComponent(checkBoxColumns, uploadFileColumns, selectColumns, DatePickerColumns) {

  const specialComponentEveryRow = [];
  /**
   * checkBoxColumns and InputSelectText is in props come from setting
   * if developer fill them we have special array that explain in up
   */

  if (checkBoxColumns) {
    if (checkBoxColumns.checkBox === 'checkBox') {

      specialComponentEveryRow.push(checkBoxColumns);
    }
  }

  if (uploadFileColumns) {
    if (uploadFileColumns.uploadFile === 'uploadFile') {
      specialComponentEveryRow.push(uploadFileColumns);
    }
  }

  if (selectColumns) {
    if (selectColumns.select === 'select')
      specialComponentEveryRow.push(selectColumns);
  }

  if (DatePickerColumns) {
    if (DatePickerColumns.DatePicker === 'DatePicker')
      specialComponentEveryRow.push(DatePickerColumns);
  }

  return specialComponentEveryRow;

};


export function controlHeaders(key, index, style, headersDesc, required) {
  if (style === 'DatePicker') {
    style = {float: 'right'}
  } else {
    style = {}
  }

  if (headersDesc) {
    if ((Object.keys(headersDesc)).includes(key)) {

      /**
       * check if is required fill out *
       */
      if (required) {
        if (required.includes(key)) {
          return <label style={style}
                        key={'label' + index}>{'* ' + headersDesc[key]} :</label>;
        } else {
          return <label style={style} key={'label' + index}>{headersDesc[key]} :</label>;
        }
      } else {
        return <label style={style} key={'label' + index}>{headersDesc[key]} :</label>;
      }
    } else {
      if (required) {
        if (required.includes(key)) {
          return <label style={style} key={'label' + index}>{'* ' + key} :</label>;
        } else {
          return <label key={'label' + index}>{key} :</label>
        }
      } else {
        return <label style={style} key={'label' + index}>{key} :</label>
      }

    }
  } else {
    if (required) {
      if (required.includes(key)) {
        return <label style={style} key={'label' + index}>{'* ' + {key}} :</label>;
      } else {
        return <label style={style} key={'label' + index}>{key} :</label>
      }
    } else {
      return <label style={style} key={'label' + index}>{key} :</label>
    }
  }
};

export function controlHeadersForValidateRequired(column, required, user) {

  let flagRequired = 0
  for (let l = 0; l < column.length; l++) {

    if (required.includes(column[l])) {
      /**
       *check state of columns=>(user) is empty or not if is not empty so flag be 0
       */
       // console.log(column[l],user[column[l]],user[column[l]],!user[column[l]] &&   user[column[l]]!==0,!user[column[l]],user[column[l]]!==0)
      if (!user[column[l]] &&   user[column[l]]!==0/*is empty so*/) {


        let inputRequired = document.getElementById(`input${[l]}`);
        let selectRequired = document.getElementById(`select${[l]}`);
        console.log(column[l],user[column[l]],l,column[l],'empty',selectRequired,inputRequired)
        // console.log(inputRequired);
        if (inputRequired)
          inputRequired.classList.add('input_required');
        if (selectRequired)
          selectRequired.classList.add('input_required');


        flagRequired = 1;
        // break;
      } else {


        let inputRequired = document.getElementById(`input${[l]}`);
        let selectRequired = document.getElementById(`select${[l]}`);
        console.log(column[l],user[column[l]],l,column[l],'fill',selectRequired,inputRequired)
        if (inputRequired)
          inputRequired.classList.remove('input_required');
        if (selectRequired)
          selectRequired.classList.remove('input_required');
      }

    }
  }
  return flagRequired
}
