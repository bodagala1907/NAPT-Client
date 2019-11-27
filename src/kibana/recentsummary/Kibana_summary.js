import React, { Component } from 'react'
import { getBuildInfo } from '../../common/jenkins-utils/Utils';

export default class Kibana_summary extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            //frameUrl : " http://localhost:5601/app/kibana#/dashboard/c5fab770-ba85-11e9-824a-19a11c362878?embed=true&_g=()"
           frameUrl: ""
        }
    }
    componentDidMount() {
        getBuildInfo('AutomationExecutionEngine', 'lastCompletedBuild').then((res) => { 
            //console.log("res",res);
            this.setState({
                frameUrl : `http://localhost:8091/job/AutomationExecutionEngine/${res.data.number}/cucumber-html-reports/overview-features.html`
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }
    
    render() {
        return (
            <iframe src={this.state.frameUrl} height="750" width="1370" title="Kibana-summary"></iframe>            
        )
    }
}
