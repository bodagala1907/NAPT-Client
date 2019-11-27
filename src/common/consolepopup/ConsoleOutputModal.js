import React, { Component } from 'react'
import {Modal} from 'react-bootstrap';
import './ConsoleOutputModal.scss';
import { getConsoleOutput } from '../../common/jenkins-utils/Utils';

export class ConsoleOutputModal extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             consoleText : null
        }
    }
    componentDidMount() {
        getConsoleOutput('AutomationExecutionEngine', 'lastCompletedBuild')
        .then((data) => {
            this.setState({
                consoleText : data.data
            })
        })
        .catch((err) => console.log(err));
   }
    updateInfo = () => {
        getConsoleOutput('AutomationExecutionEngine', 'lastCompletedBuild')
        .then((data) => {
            this.setState({
                consoleText : data.data
            })
        })
        .catch((err) => console.log(err));
    }
    render() {
        console.log(typeof(this.state.consoleText))
        return (
            <Modal
            {...this.props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton className="modal-head">
                <Modal.Title id="contained-modal-title-vcenter">
                Console Output
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="content">
                <pre>
                    <code>{this.state.consoleText}</code>
                </pre>
                </div>
            </Modal.Body>
            </Modal>
        )
    }
}

export default ConsoleOutputModal

