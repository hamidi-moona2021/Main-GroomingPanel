import React,{PureComponent} from 'react';
import {Pagination, PaginationItem, PaginationLink} from "reactstrap";

class Paging extends PureComponent {

  constructor(props) {
    super(props);
    // console.log('props',props);
    this.state = {
      inputValue: 1,
      start: 1,
    }
  }


  firstButtonHandle = (e, firstPage) => {

    this.props.handlePageClick(e, firstPage);
    this.setState({start: firstPage})
  };

  lastButtonHandle = (e, lastPage) => {

    this.props.handlePageClick(e, lastPage);
    this.setState({start: 3})
  };

  handleInputChange = (e) => {
    this.setState({inputValue: e.target.value, start: e.target.value});
  };

  counterFunc = (firstPage, lastPage, start, finish, counter, button_OF_page) => {
    // console.log('start ', start, finish, counter);
    button_OF_page.push(<PaginationItem key={'firstPage'}><PaginationLink key={'firstPageLink'} onClick={(e) => {
      this.firstButtonHandle(e, 1)
    }} href="#"> {'<<'} </PaginationLink></PaginationItem>);

    button_OF_page.push(<PaginationItem key={'prevPage'}><PaginationLink key={'prevPageLink'}
                                                                         href="#"> {'<'} </PaginationLink></PaginationItem>);


    for (let i = start; i < finish; i++) {

      button_OF_page.push(<div key={`paginate${i}`}>


        <PaginationItem key={`page${i}`}> <PaginationLink key={`page${i}Link`} onClick={(e) => {
          this.props.handlePageClick(e, i)
        }} href="#">
          {i}
        </PaginationLink></PaginationItem>

      </div>)
    }


    button_OF_page.push(<PaginationItem key={'nextPage'}><PaginationLink key={'nextPageLink'} href="#"
                                                                         previous> {'>'} </PaginationLink></PaginationItem>);


    button_OF_page.push(<PaginationItem key={'lastPage'}><PaginationLink key={'lastPageLink'} onClick={(e) => {
      this.lastButtonHandle(e, lastPage)
    }} href="#"> {'>>'} </PaginationLink></PaginationItem>);
    button_OF_page.push(<label key={'labelPagee'} id={'labelPage'} style={{width: '55px'}}>دسته : </label>)
    button_OF_page.push(<input style={{width: '25px', textAlign: 'center'}} key={'inputPAge'} type="text"
                               value={this.state.inputValue}
                               onChange={this.handleInputChange}/>);

  };

  controlPagging = () => {

    // console.log('control')
    /**
     * (count === counter) is count of page
     */
    // console.log('org count',this.props.count_OF_row)
    let count = this.props.count_OF_row / this.props.dataParamsSelect.count;
    let baghi = this.props.count_OF_row % this.props.dataParamsSelect.count;

    let button_OF_page = [];
    var counter = Math.floor(count);
    if (baghi === 0) {
      // counter = 1 + counter;
    } else {
      counter = 1 + counter;
    }

    var firstPage = 1;
    var lasPage = counter;
    var start = this.state.start;
    var finish = 10;

    if (this.state.start <= 0) {

      start = 1;
      // this.setState({inputValue:"1",start:1})
    }

    // console.log('counter is : ' , counter);
    if (counter < 10) {

      start = 1;
      finish = counter + 1;

    } else if (Math.floor(counter / 10) < start) {
      // console.log(start, Math.floor(counter / 10) + 1);
      if ((start >= Math.floor(counter / 10) + 1)) {

        start = (Math.floor(counter / 10)  * 10) + 1;
        baghi=counter%10;
        finish = start + baghi;
        // console.log('start', start, 'finish', finish)
      } else {
        start = ((start - 1) * 10) + 1;
        finish = start + baghi;

      }
    } else {
      start = ((start - 1) * 10) + 1;
      finish = start + 10;
    }

    this.counterFunc(firstPage, lasPage, start, finish, counter, button_OF_page);

    return button_OF_page
  };

  render() {
    return (
      <div>

        <Pagination id={'paginationAlizade'}>
          {this.controlPagging()}
        </Pagination>
      </div>
    );
  }
}

export default Paging;
