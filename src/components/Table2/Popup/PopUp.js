import React from 'react';
import './Popup.css';

class Popup extends React.Component {

  render() {

    return (
      <div className='popup'>
        <div>
          <h1>{this.props.text}</h1>
          <button onClick={this.props.closePopup}>بستن</button>
          <button onClick={this.props.deletePopup}>حذف</button>
        </div>
      </div>
    );
  }

}

export default Popup;
