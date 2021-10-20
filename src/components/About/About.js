import React from 'react';


class About extends React.Component {

    componentDidMount() {
        let search = window.location.search;
        // console.log(search);
        let params = new URLSearchParams(search);
        // console.log(params);
        let foo = params.get('query');
        // console.log('***********', foo);
    }

    render() {

        return <div>
            <span>sinaCompany</span>

        </div>
    }
}

export default About;
