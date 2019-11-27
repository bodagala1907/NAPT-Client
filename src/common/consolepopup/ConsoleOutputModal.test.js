import React from 'react';
import { shallow } from 'enzyme';
import ConsoleOutputModal from './ConsoleOutputModal';
import {Modal} from 'react-bootstrap';
import { findByTestAtrr } from '../../../testUtils/index';
import * as jenkinsApi from '../../common/jenkins-utils/Utils';

const setUp = () => {
    const wrapper = shallow(<ConsoleOutputModal/>);
    return wrapper;
};

describe('ConsoleOutputModal Component', () => { 
    let wrapper, mockJenkins, componentInstance;
    beforeEach(() => {
        wrapper = setUp();
        mockJenkins = jest.spyOn(jenkinsApi, 'getConsoleOutput');
        componentInstance = wrapper.instance();
    });
    it('Should render with footer class', () => {
        const modal = findByTestAtrr(wrapper, Modal);
        const modalHeader = findByTestAtrr(wrapper, Modal.Header);
        expect(modal.length).toBe(1);
        expect(modalHeader.length).toBe(1);
    });
    it('Should update consoleText data when updateInfo() called', () => {
        mockJenkins.mockImplementation(() => Promise.resolve('console text'));
        componentInstance.updateInfo();
        expect(mockJenkins).toHaveBeenCalled();
    });
    describe('componentDidMount() >>>', () => {
        it('Should update the state when jenkins response with success', async () => {
            mockJenkins.mockImplementation(() => Promise.resolve('console text'));
            await componentInstance.componentDidMount();
            expect(componentInstance.state.consoleText).toEqual('console text');
            expect(mockJenkins).toHaveBeenCalled();
        });
        it('Should not update the state when jenkins response with error',async () => {
            mockJenkins.mockImplementation(() => Promise.reject({}));
            await componentInstance.componentDidMount();
            expect(componentInstance.state.consoleText).toEqual(null);
            expect(mockJenkins).toHaveBeenCalled();
        });
    });
    describe('updateInfo() >>>', () => {
        it('Should update the state when jenkins response with success', async () => {
            mockJenkins.mockImplementation(() => Promise.resolve('console text'));
            await componentInstance.updateInfo();
            expect(componentInstance.state.consoleText).toEqual('console text');
            expect(mockJenkins).toHaveBeenCalled();
        });
        it('Should not update the state when jenkins response with error',async () => {
            mockJenkins.mockImplementation(() => Promise.reject('console text'));
            await componentInstance.updateInfo();
            expect(componentInstance.state.consoleText).toEqual(null);
            expect(mockJenkins).toHaveBeenCalled();
        });
    });
});