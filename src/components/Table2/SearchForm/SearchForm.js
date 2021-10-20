import React, {PureComponent} from 'react';
import '../AddForm/AddUserForm.css'
import {Col, Row} from "reactstrap";

class SearchForm extends PureComponent {

  constructor(props) {
    super(props);
  }

  state = {
    user: this.props.initialFormState,
    checkBox: false
  }
  onChangeLOV = (e, selectOptions_set) => {
    /**
     *e.target.options[e.target.selectedIndex].value is primary key in DB
     * value in options is primary key
     */
    this.setState({user: {...this.state.user, [selectOptions_set]: e.target.options[e.target.selectedIndex].value}});
  };
  controlSelect = (selectOptions, key) => {
    /**
     * selectOptions is one row of path that path is set in setting => path in setting is array that
     * every row in path is => one list of value = one (LOV)
     * @keysSelectOptions is name of columns that come from server
     */
    // console.log('selectOptions', selectOptions, 'key is ', key);
    if (selectOptions[key]) {
      let keysSelectOptions = (Object.keys((selectOptions[key])[0]));
      // console.log('keysSelectOptions', keysSelectOptions,);
      if (selectOptions.show && selectOptions.set) {

        if (keysSelectOptions.includes(selectOptions.show) && keysSelectOptions.includes(selectOptions.set)) {
          const options = [];
          for (let e = 0; e < selectOptions[key].length; e++) {
            // console.log((selectOptions[e]))
            options.push(<option id={'select' + ((selectOptions[key])[e])[keysSelectOptions[0]]} key={'option' + e}
                                 value={((selectOptions[key])[e])[keysSelectOptions[0]]}> {((selectOptions[key])[e])[keysSelectOptions[1]]}</option>)
          }
          return <select onChange={(e) => {
            this.onChangeLOV(e, key)
          }} defaultValue={""}>
            <option id={'select0'} value=""></option>
            {options}
          </select>
        } else {
          // console.log('no columns exist');
          return <select onChange={(e) => {
            this.onChangeLOV(e, key)
          }} defaultValue={""}>
            <option id={'select0'} value=""></option>
            <option value="no">no items</option>

          </select>
        }


      } else {
        console.log('please set show and set param');

        return <select onChange={(e) => {
          this.onChangeLOV(e, key)
        }} defaultValue={""}>
          <option value=""></option>
          <option value="no">no items</option>

        </select>
      }

    } else {
      return <select onChange={(e) => {
        this.onChangeLOV(e, key)
      }} defaultValue={""}>
        <option value=""></option>
        <option value="no">no items</option>

      </select>

    }


  };
  handleInputChange = event => {


    const {name, value} = event.target;
    // console.log(event.target.value, this.state.user);

    this.setState({user: {...this.state.user, [name]: value}})
    // console.log('user in add form')
  };

  /**
   * this function check special components like checkBox,radioButton,select,...
   * if we have every of this components make special array => [{checkBox: "checkBox", columns: Array(1)}]
   * that first home of every object is name of components that we use it
   * and pass to the  RowValues(foreach for table is every Row)   *
   */
  controlTypeColumnsComponent = () => {
    // console.log('controlTypeColumnsComponent');
    // console.log(props.checkBoxColumns);
    const specialComponentEveryRow = [];
    /**
     * checkBoxColumns and InputSelectText is in props come from setting
     * if developer fill them we have special array that explain in up
     */
    if (this.props.checkBoxColumns) {
      if (this.props.checkBoxColumns.checkBox === 'checkBox') {

        specialComponentEveryRow.push(this.props.checkBoxColumns);
      } else {
        // console.log('dont have property checkBox in setting in object checkBoxColumns')


      }


    }
    if (this.props.selectColumns) {
      if (this.props.selectColumns.select === 'select')
        specialComponentEveryRow.push(this.props.selectColumns);
    }
    // console.log('in edit mode specialComponentEveryRow', specialComponentEveryRow);
    return specialComponentEveryRow;

  };

  controlHeaders = (key, index) => {


    if (this.props.headersDesc) {
      if ((Object.keys(this.props.headersDesc)).includes(key)) {

        /**
         * check if is required fill out *
         */
        if (this.props.requiredInsert) {
          if (this.props.requiredInsert.includes(key)) {
            return <label key={'label' + index}>{'* ' + this.props.headersDesc[key]} </label>;
          } else {
            return <label key={'label' + index}>{this.props.headersDesc[key]} </label>;
          }
        } else {
          return <label key={'label' + index}>{this.props.headersDesc[key]} </label>;
        }
      } else {
        if (this.props.requiredInsert) {
          if (this.props.requiredInsert.includes(key)) {
            return <label key={'label' + index}>{'* ' + key} </label>;
          } else {
            return <label key={'label' + index}>{key} </label>
          }
        } else {
          return <label key={'label' + index}>{key} </label>
        }

      }
    } else {
      if (this.props.requiredInsert) {
        if (this.props.requiredInsert.includes(key)) {
          return <label key={'label' + index}>{'* ' + {key}} </label>;
        } else {
          return <label key={'label' + index}>{key} </label>
        }
      } else {
        return <label key={'label' + index}>{key} </label>
      }
    }
  };

  returnAddForm = (g) => {
    let column = Object.keys(this.props.initialFormState);
    let countColumn = Object.keys(this.props.initialFormState).length;
    var countColumnInDIV = countColumn / 2;
    let specialComponentEveryRow = this.controlTypeColumnsComponent();
    return (

      column.map((key, index) => {


        if ((index + 1) % 2 === g) {


          if (this.props.renderInsert) {
            if (this.props.renderInsert.includes(key)) {
              return null;
            }
          }

          /**
           * z = every special components = @specialComponent EveryRow is all specials components with columnsName that have this  like [{checkBox: "checkBox", columns: Array(1)}]
           *  is work just for special col of row table
           */
          for (let z = 0; z < specialComponentEveryRow.length; z++) {
            // console.log('row ', i, ' column ', h, array_of_columns[h], ' spec ', z, specialComponentEveryRow[z].columns);
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
                      // console.log('resultLOV is : ', specialComponentEveryRow[z].path[s]);
                    }
                  }
                } else {
                  console.log('select dont have path');
                }
              }
            }
          }

          switch (switchComponents) {
            case "checkBox":
              this.state.checkBox = (key != null ? key : false);
              return <div key={index}>

                {this.controlHeaders(key, index)}

                <input id={`input${Object.keys(this.props.initialFormState)[index]}`} key={'input' + index}
                       type="checkbox"
                       name={key}

                  //TODO:call with keys =>chekBox[key]
                       onChange={this.handleInputChange} defaultChecked={this.state.checkBox}/>
              </div>;


            case 'select':
              // console.log('sss', selectOptions)
              return <div key={index}>
                {this.controlHeaders(key, index)}

                {this.controlSelect(selectOptions, key)}


              </div>;

            default:
              return <div key={index}>

                {this.controlHeaders(key, index)}
                {/*<div className="" onClick={handleClickColor}>click here</div>*/}
                <input id={`input${Object.keys(this.props.initialFormState)[index]}`}
                       placeholder={this.props.headersDesc[key]}
                       key={'input' + index} type="text"
                       name={Object.keys(this.props.initialFormState)[index]}
                       value={this.state.user[Object.keys(this.props.initialFormState)[index]] != null ? this.state.user[Object.keys(this.props.initialFormState)[index]] : ''}
                       onChange={this.handleInputChange}/>
              </div>
          }
          return [];
        }


      })

    )
  };

  onClickAdd = () => {
    // console.log('add *');
  };
   cancelButton = () => {
    this.props.controlPopUp(4);
  };

  render() {

    return (
      <form /*style={{display: 'flex'}}*/
        onSubmit={event => {
          // console.log('call insert in submit form')
          event.preventDefault();

          let flagRequired = 0;
          if (this.props.requiredInsert) {

            for (let l = 0; l < Object.keys(this.props.initialFormState).length; l++) {

              if (this.props.requiredInsert.includes(Object.keys(this.props.initialFormState)[l])) {

                if (!this.state.user[Object.keys(this.props.initialFormState)[l]]) {
                  let inputRequired = document.getElementById(`input${Object.keys(this.props.initialFormState)[l]}`);
                  // console.log(inputRequired);
                  if (inputRequired)
                    inputRequired.classList.add('input_required');
                  flagRequired = 1;


                } else {
                  let inputRequired = document.getElementById(`input${Object.keys(this.props.initialFormState)[l]}`);
                  // console.log(inputRequired);
                  inputRequired.classList.remove('input_required');

                }

              }
            }


          }
          if (flagRequired === 1) {
            return;

          }


          this.props.controlPopUp(0);
          // console.log('call addUser', user)
          this.props.addSearch(this.state.user);
          this.setState({user: this.props.init});
        }}
      >


        <Row>
          {/*</div>*/}
          <Col xs="12" lg="6">
            <div id={'leftDIV'}>

              {this.returnAddForm(0)}

            </div>
          </Col>
          <Col xs="12" lg="6">
            <div id={'rightDIV'}>

              {this.returnAddForm(1)}

            </div>
          </Col>


          <button onClick={() => {
            this.onClickAdd()
        }}>جستجو کردن
          </button>
          <button onClick={this.cancelButton} className="button muted-button">
            بازگشت
          </button>
        </Row>
      </form>
    )
  }
};

export default SearchForm
