import React from 'react';
import './Popup.css';

class Popup extends React.Component {


  state = {
    text: ''
  };

  close = () => {
    if(this.props.closePopup){
      this.props.closePopup();
    }
  };


  render() {
    let text = this.props.text;
    let children = this.props.children;
    return (
      <div className='popup2'>

        <div style={{width: `${this.props.orgWidth}`, height: `${this.props.orgHeight}`}} className='popup_inner2'>

        <div className='formPopUP'>

          <a  onClick={() => {
            this.close()
          }} className="close"></a>
          <h1>{text}</h1>
          {children}
        </div>

        </div>
      </div>
    );
  }
}

export default Popup;
