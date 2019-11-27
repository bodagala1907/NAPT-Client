import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAtrr } from '../../testUtils/index';
import Execution from './Execution';
import * as jenkinsApi from '../common/jenkins-utils/Utils';

const setUp = () => {
    const wrapper = shallow(<Execution/>);
    return wrapper;
};

describe('Execution Component', () => { 
    let wrapper, componentInstance,mockJenkins;
    beforeEach(() => {
        wrapper = setUp();
        componentInstance = wrapper.instance();
        mockJenkins = jest.spyOn(jenkinsApi, 'getBuildInfo');
    });
    it('Should render without error', () => {
        const tag = findByTestAtrr(wrapper, '.build-info');
        const list = findByTestAtrr(wrapper, 'ul');
        expect(tag.length).toBe(0);
        expect(list.length).toBe(0);
    });
    it('Should Update state as expected when jenkins response with success ', async () => {
        const data = {building : true, result : 'SUCCESS', actions : [{parameters : [{name : '', value : ''}]}]};
        await mockJenkins.mockImplementation(() => Promise.resolve(data)); 
        await componentInstance.componentDidMount();
        const listItems = findByTestAtrr(wrapper, 'li');
        expect(componentInstance.state.buildInfo).toEqual(data);
        expect(mockJenkins).toHaveBeenCalled();
        expect(listItems.length).toBe(1);
    });
    it('Should not Update state as expected when jenkins response with success ', async () => {
        await mockJenkins.mockImplementation(() => Promise.reject({})); 
        await componentInstance.componentDidMount();
        const listItems = findByTestAtrr(wrapper, 'li');
        expect(componentInstance.state.buildInfo).toEqual(null);
        expect(mockJenkins).toHaveBeenCalled();
        expect(listItems.length).toBe(0);
    });
    it('Should Update state as expected when reRenderInfo() called', async () => {
        const data = {building : true, result : 'FAILURE'};
        await mockJenkins.mockImplementation(() => Promise.resolve(data)); 
        await componentInstance.reRenderInfo();
        expect(componentInstance.state.buildInfo).toEqual(data);
        expect(mockJenkins).toHaveBeenCalled();
    });
    it('openConsoleOutput() should call setConsoleModalShow', () => {
        const mockSetConsoleModalShow = jest.spyOn(componentInstance, 'setConsoleModalShow');
        componentInstance.openConsoleOutput();
        expect(mockSetConsoleModalShow).toHaveBeenCalled();
    });
    it('setConsoleModalShow should update state as expected', () => {
        const oldState = componentInstance.state.consoleModalShow;
        componentInstance.setConsoleModalShow();
        const newState = componentInstance.state.consoleModalShow;
        expect(oldState).toEqual(!newState);
    });
});