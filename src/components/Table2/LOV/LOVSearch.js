import React, {PureComponent} from 'react';
import './LOV.css'
// import OutsideAlerter from './../OutSideClick/OutsideAlerter'
// import axios from "axios";
// import config from "../../../../config";

class LOVSearch extends PureComponent {


  constructor(props) {
    super(props);

  }

  state = {
    flagOut: false,
    // user: this.props.user,
    [this.props.columnName]: this.props.selected ? this.props.selected : '',
    options: this.props.options,
    column: this.props.columnName
  };


  myFunction = (myDropdown) => {

    document.getElementById(myDropdown).classList.remove("close");
    document.getElementById(myDropdown).classList.add("show");

  };
  close = (myDropdown) => {

    document.getElementById(myDropdown).classList.remove("show");
    document.getElementById(myDropdown).classList.add("close")

  };

  filterFunction = (myDropdown, myInput) => {
    var input, filter, option, i;
    input = document.getElementById(myInput);
    filter = input.value.toUpperCase();
    let div = document.getElementById(myDropdown);
    option = div.getElementsByTagName("option");
    for (i = 0; i < option.length; i++) {
      let txtValue = option[i].textContent || option[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        option[i].style.display = "";
      } else {
        option[i].style.display = "none";
      }
    }
  };

  handleInputChange = event => {

    if (event.target.type === 'text') {

    }

  };

  reset = (e, column) => {
    this.setState({
      [this.props.columnName]: "",
    });
    this.props.FromDetailForAddUserForm('LOVSearch', e, column);
  };

  onChangeLOV = (e, column) => {
    //console.log('e', e.target);
    this.setState({
      [column]: e.target.innerHTML
    });
    this.props.FromDetailForAddUserForm('LOVSearch', e, column);
  };


  render() {
    // console.log('render LOV SEARCH', this.state);
    let options = this.state.options;
    let column = this.state.column;

    /**
     * id set in lov and name is show in lov
     */
    let id, name = '';

    id = this.props.set;
    name = this.props.show;

    return (
      <>
        {options.length > 0 ?
          <div className="dropdown">
            <input id={this.props.pk} placeholder='انتخاب کنید...' name={column} key={`myInput${column}`}
                   onChange={this.handleInputChange} value={this.state[column]}
                   onClick={() => {
                     this.myFunction("myDropdown" + column)
                   }} className=""/>
            <a onClick={(e) => {
              this.reset(e, column)
            }} style={{color: 'Blue', textDecoration: 'underline'}}>خالی کردن</a>

            <div id={"myDropdown" + column} className="dropdown-content">

              <input type="text" placeholder="جستجو..." id={`myInput${column}`}
                     className='myInput' onKeyUp={() => {
                this.filterFunction("myDropdown" + column, `myInput${column}`)
              }}/>
              <a onClick={() => {
                this.close("myDropdown" + column)
              }} className="close"/>

              <div className="optionsLOV">

                <option onClick={(e) => {
                  this.onChangeLOV(e, column)
                }} id={'select0'} value=""/>
                {options.map((key, index) => {
                    return <option /*style={{border:'inset' ,radius:'5px'}}*/

                      key={'option' + index}
                      onClick={(e) => {
                        this.onChangeLOV(e, column)
                      }}
                      value={((options)[index])[id]}>
                       {`${index+1} - `+((options)[index])[name]}
                    </option>
                  }
                )}

              </div>

            </div>

          </div> :
          <select defaultValue={""}>

            <option id={'select0'} value=""></option>
            <option value="no">no items for search</option>

          </select>}

      </>
    );
  }
}

export default LOVSearch;
