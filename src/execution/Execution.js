import React,{Component} from 'react';
import './Execution.scss'
import {ButtonToolbar} from 'react-bootstrap';
import ConsoleOutputModal from '../common/consolepopup/ConsoleOutputModal';
import { getBuildInfo } from '../common/jenkins-utils/Utils';
const ref = React.createRef();

class Execution extends Component{
    constructor(props) {
        super(props)
    
        this.state = {
            buildInfo : null,
            consoleModalShow : false
        }
    }
    componentDidMount() {
        getBuildInfo('AutomationExecutionEngine', 'lastCompletedBuild').then((res) => { 
            console.log("res",res);
            this.setState({
                buildInfo : res.data
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }
    reRenderInfo = () => {
        getBuildInfo('AutomationExecutionEngine', 'lastCompletedBuild').then((res) => { 
            this.setState({
                buildInfo : res.data
            }, () => {
                ref.current.updateInfo();
                //console.log(this.state.buildInfo['actions'])
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }
    openConsoleOutput = () => {
        this.setConsoleModalShow();
    }
    setConsoleModalShow = () => {
        this.setState({
            consoleModalShow : !this.state.consoleModalShow,
        })
     }

    render(){
        const buildInfo = this.state.buildInfo;
        const statusClass = buildInfo && buildInfo.result && (buildInfo.result === 'SUCCESS' ? 'success' : 'danger');
        const statusIcon = statusClass && (statusClass === 'success' ? 'check' : 'exclamation-triangle');
        const buildNumber = buildInfo && buildInfo.number;
        const buildStatus = buildInfo && (buildInfo.result === 'FAILURE' ? 'FAILED' : buildInfo.result);
        return(
            <div>
            { buildInfo && (
                <div className="mt-3 build-info">
                    <h5 className="info-header d-flex justify-content-between p-2 m-0">
                        <span>
                            <span>Last Build Info</span>
                        </span>
                        <div>
                            <span onClick={this.openConsoleOutput} className="view-logs">
                                <i className="fa fa-eye mr-1"></i>
                                <span>View Logs</span>
                            </span>
                            <span className={`text-${statusClass}`}>
                                <i className={`fa fa-${statusIcon} mr-1`} aria-hidden="true"></i>
                                <span>BUILD {' ' + buildStatus}(ID:{buildNumber})</span>
                            </span>
                        </div>
                    </h5>
                    <div className="parameter-list">
                        <div className="list-group-item">
                            <div className="row"> 
                                <span className="col-4"><strong>Parameter Name</strong></span>
                                <span className="col-8"><strong>Parameter Value</strong></span>
                            </div>
                        </div>
                        <ul className="list-group">
                        {buildInfo['actions'][0] && buildInfo['actions'][0]['parameters'] && buildInfo['actions'][0]['parameters'].map((parameter) => {
                            return (
                                <li key={parameter.name} className="list-group-item">
                                    <div className="row">
                                        <span className="col-4">{parameter.name}</span>
                                        <span className="col-8">{parameter.value}</span>
                                    </div>
                                </li>
                            ) 
                        })}
                        </ul>
                    </div>
                </div>
                )}
                <ButtonToolbar>
                    <ConsoleOutputModal
                    ref={ref}
                    show={this.state.consoleModalShow} 
                    onHide={this.setConsoleModalShow}
                    />
                </ButtonToolbar>
            </div>
        )
    }
}
export default Execution;