import React from 'react'
import {Modal,Button} from 'react-bootstrap';
import './Modal.scss'

function ModalPopup(props) {
    const params = props.params;
    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton className="modal-head">
            <Modal.Title id="contained-modal-title-vcenter">
              Build Parameters
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row ml-4">
                <span className="col-4"><strong>Parameter Name</strong></span>
                <span className="col-8"><strong>Parameter Value</strong></span>
            </div>
            <ul>
                {
                Object.keys(params).map((param,index) => {
                return (
                <li key={index} className="row">
                    <span className="col-4">{param}</span>
                    <span className="col-8">{params[param]}</span>
                </li>
                )
                })
                }
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide} className="btn btn-danger">Cancel</Button>
            <Button onClick={props.onBuildButtonClick} className="btn btn-success">Confirm</Button>
          </Modal.Footer>
        </Modal>
      );
}

export default ModalPopup
