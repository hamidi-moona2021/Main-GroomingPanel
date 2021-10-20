import React from 'react';

class CheckBox extends React.Component {
    state = {
        [this.props.columnName]: this.props.checked
    }

    handleInputChange = (event) => {
        if (event.target.type === 'checkbox') {

            const { name, checked } = event.target;
            // console.log('checkbox', name, checked);
            this.setState({
                [name]: checked
            });
            this.props.FromDetailForAddUserForm('checkbox', event, name);
        }
    };

    render() {
        let index = this.props.indexColumn;
        let key = this.props.columnName;
        let id = this.props.idColumn;
       
        return (
            <>
                <input id={this.props.pk}
                    key={'input' + index}
                    type="checkbox"
                    name={key}
                    onChange={this.handleInputChange} checked={this.state[key]} />
            </>
        );
    }
}

export default CheckBox;
