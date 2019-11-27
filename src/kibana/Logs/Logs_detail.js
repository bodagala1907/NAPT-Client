import React, { Component } from 'react'

class Kibana_detail extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            frameUrl : " http://localhost:5601/app/kibana#/dashboard/0db5ea00-fecc-11e9-be17-b5af562b752c?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-2d%2Cto%3Anow))"
                       
        }
    }
    
    render() {
        return (
            <iframe src={this.state.frameUrl} height="750" width="1370" title="Kibana-detail"></iframe>            
        )
    }
}

export default Kibana_detail
