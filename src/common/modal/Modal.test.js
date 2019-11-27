import React from 'react';
import { shallow } from 'enzyme';
import {Modal, Button} from 'react-bootstrap';
import { findByTestAtrr } from '../../../testUtils/index';
import ModalPopup from './Modal';

const setUp = (props) => {
    const wrapper = shallow(<ModalPopup {...props}/>);
    return wrapper;
};

describe('ModalPopup Component', () => { 
    let wrapper, mockOnHide, mockOnBuildButtonClick;
    beforeEach(() => {
        mockOnHide = jest.fn();
        mockOnBuildButtonClick = jest.fn();
        const props = {
            show : true,
            onHide : mockOnHide,
            params : {projectName : 'Test_Project'},
            onBuildButtonClick : mockOnBuildButtonClick
        }
        wrapper = setUp(props);
    });
    it('Should render without error', () => {
        const modal = findByTestAtrr(wrapper, Modal);
        const modalHeader = findByTestAtrr(wrapper, Modal.Header);
        const modalFooter = findByTestAtrr(wrapper, Modal.Footer);
        const list = findByTestAtrr(wrapper, 'ul');
        expect(modal.length).toBe(1);
        expect(modalHeader.length).toBe(1);
        expect(modalFooter.length).toBe(1);
        expect(list.length).toBe(1);
    });
    it('Should emit onHide event callback on Cancel', () => {
        const button = findByTestAtrr(wrapper, Button);
        button.at(0).simulate('click');
        const callback = mockOnHide.mock.calls.length;
        expect(callback).toBe(1);
    });
    it('Should emit  onBuildButtonClick event callback on Confirm', () => {
        const button = findByTestAtrr(wrapper, Button);
        button.at(1).simulate('click');
        const callback = mockOnBuildButtonClick.mock.calls.length;
        expect(callback).toBe(1);
    });
});