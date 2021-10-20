import React, {Component} from 'react';
import {Alert} from 'reactstrap';

class DangerAlerts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };

    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss() {
    this.setState({visible: false});
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Alert color="primary">
          {this.props.textDialog}

        </Alert>

      </div>
    );
  }
}

export default DangerAlerts;
