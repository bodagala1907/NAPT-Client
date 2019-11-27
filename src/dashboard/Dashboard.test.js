import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAtrr } from '../../testUtils/index';
import Dashboard from './Dashboard';
import * as API from '../common/api/Api';
import * as jenkinsApi from '../common/jenkins-utils/Utils';

jest.useFakeTimers();

const setUp = () => {
    const wrapper = shallow(<Dashboard/>);
    return wrapper;
};

describe('Dashboard Component>>>', () => { 
    let wrapper;
    beforeEach(() => {
        wrapper = setUp();
    });
    it('Should render without error', () => {
        const select = findByTestAtrr(wrapper, 'select');
        const ButtonToolbar = findByTestAtrr(wrapper, 'ButtonToolbar');
        const ModalPopup = findByTestAtrr(wrapper, 'ModalPopup');
        expect(select.length).toBe(7);
        expect(ButtonToolbar.length).toBe(1);
        expect(ModalPopup.length).toBe(1);
    });
    describe('ComponentDidMount>>>', () => {
        let componentInstance, mockApi, mockGetBuildInfo;
        beforeEach(() => {
            componentInstance = wrapper.instance();
            mockApi = jest.spyOn(API, 'getProjects');
            mockGetBuildInfo = jest.spyOn(jenkinsApi, 'getBuildInfo');
        });
        it('Should call API and update state with projects data', async () => {
            const projects = ["API_Test"];
            const buildResponse = {building : true};
            await mockGetBuildInfo.mockImplementation(() => Promise.resolve(buildResponse)); 
            await mockApi.mockImplementation(() => Promise.resolve(projects)); 
           
            await componentInstance.componentDidMount();
            expect(componentInstance.state.projects).toEqual(projects);
            expect(mockApi).toHaveBeenCalled();
            expect(mockGetBuildInfo).toHaveBeenCalled();
        });
        it('Should reject API call and should not update state with projects data', async () => {
            await mockGetBuildInfo.mockImplementation(() => Promise.reject({}));
            await mockApi.mockImplementation(() => Promise.reject({})); 
           
            await componentInstance.componentDidMount();
            expect(componentInstance.state.projects).toEqual([]);
            expect(mockApi).toHaveBeenCalled();
            expect(mockGetBuildInfo).toHaveBeenCalled();
        });
        it('Should should not update state when no builds are running', async () => {
            const buildResponse = {building : false};
            await mockGetBuildInfo.mockImplementation(() => Promise.resolve(buildResponse));
            await componentInstance.componentDidMount();
            expect(componentInstance.state.projects).toEqual([]);
            expect(componentInstance.state.submitted).toEqual(false);
            expect(mockGetBuildInfo).toHaveBeenCalled();
        });

    });
    describe('ComponentWillUnmount>>>', () => {
        let componentInstance, mockInterval;
        beforeEach(() => {
            componentInstance = wrapper.instance();
            mockInterval = jest.spyOn(window, 'clearInterval');
        });
        it('Should clear interval', () => {
            componentInstance.componentWillUnmount();
            expect(mockInterval).toHaveBeenCalled();
        });
    });
    describe('Should update the state according to the selected value', () => {
        let componentInstance;
        beforeEach(() => {
            componentInstance = wrapper.instance();
        });
        it('Should update testCaseType as expected', () => {
            const select = findByTestAtrr(wrapper, { name: 'testCaseType' });
            select.simulate('change', {target  : { name :  'testCaseType',value : 'UI'}});
            expect(componentInstance.state.params.testCaseType).toEqual('UI');
        });
        it('Should update testCaseType as expected', () => {
            const select = findByTestAtrr(wrapper, { name: 'testCaseType' });
            select.simulate('change', {target  : { name :  'testCaseType',value : 'API'}});
            expect(componentInstance.state.params.testCaseType).toEqual('API');
        });
        it('Should update testEnv as expected', () => {
            const select = findByTestAtrr(wrapper, { name: 'testEnv' });
            select.simulate('change', {target  : { name :  'testEnv',value : 'TEST_ENV'}});
            expect(componentInstance.state.params.testEnv).toEqual('TEST_ENV');
        });
        it('Should update browser as expected', () => {
            const select = findByTestAtrr(wrapper, { name: 'browser' });
            select.simulate('change', {target  : { name :  'browser',value : 'Chrome'}});
            expect(componentInstance.state.params.browser).toEqual('Chrome');
        });
        it('Should update projectName and state as expected', async () => {
            const mockApi = jest.spyOn(API, 'getProjectTags');
            await mockApi.mockImplementation(() => Promise.resolve(['sanity'])); 
            const select = await findByTestAtrr(wrapper, { name: 'projectName' });
            await select.simulate('change', {target  : { name :  'projectName',value : 'Test_Project'}});
            expect(componentInstance.state.params.projectName).toEqual('Test_Project');
            expect(componentInstance.state.testSuites).toEqual(['sanity']);
        });
        it('Should update projectName and should not update testSuites when API rejects', async () => {
            const mockApi = jest.spyOn(API, 'getProjectTags');
            await mockApi.mockImplementation(() => Promise.reject({})); 
            const select = await findByTestAtrr(wrapper, { name: 'projectName' });
            await select.simulate('change', {target  : { name :  'projectName',value : 'Test_Project'}});
            expect(componentInstance.state.params.projectName).toEqual('Test_Project');
            expect(componentInstance.state.testSuites).toEqual([]);
        });
        describe('TestSuite multuselect dropdown', () => {
            let mockApi, select;
            beforeEach(async () => {
                mockApi = jest.spyOn(API, 'getProjectTags');
                await mockApi.mockImplementation(() => Promise.resolve(['sanity','regression'])); 
                select= await findByTestAtrr(wrapper, { name: 'projectName' });
                await select.simulate('change', {target  : { name :  'projectName',value : 'Test_Project'}});
            })
            it('Should update TestSuite as expected when we select the item', async () => {
                const checkboxSelected = await findByTestAtrr(wrapper, { value: 'sanity' });
                await checkboxSelected.simulate('change', {target  : { name :  'testSuiteOption',value : 'sanity'}});
                expect(componentInstance.state.params.testSuiteType).toEqual('sanity');
                const checkboxUnSelected = await findByTestAtrr(wrapper, { value: 'sanity' });
                await checkboxUnSelected.simulate('change', {target  : { name :  'testSuiteOption',value : 'sanity'}});
                expect(componentInstance.state.params.testSuiteType).toEqual('Select test suite');
            });
            it('Should update TestSuite as expected when we remove the item', async () => {
                const checkboxSelected = await findByTestAtrr(wrapper, { value: 'sanity' });
                await checkboxSelected.simulate('change', {target  : { name :  'testSuiteOption',value : 'sanity'}});
                expect(componentInstance.state.params.testSuiteType).toEqual('sanity');
                const removeTag = await findByTestAtrr(wrapper, 'i');
                await removeTag.simulate('click', 'sanity');   
                expect(componentInstance.state.params.testSuiteType).toEqual('Select test suite');
            });
            it('Should update TestSuite as expected when we remove the item', async () => {
                const checkboxSelected1 = await findByTestAtrr(wrapper, { value: 'sanity' });
                await checkboxSelected1.simulate('change', {target  : { name :  'testSuiteOption',value : 'sanity'}});
                const checkboxSelected2 = await findByTestAtrr(wrapper, { value: 'regression' });
                await checkboxSelected2.simulate('change', {target  : { name :  'testSuiteOption',value : 'regression'}});
                expect(componentInstance.state.params.testSuiteType).toEqual('sanity,regression');
                const removeTag = await findByTestAtrr(wrapper, 'i');
                await removeTag.at(0).simulate('click', 'sanity');   
                expect(componentInstance.state.params.testSuiteType).toEqual('regression');
            });
            it('Should search the TestSuites as expected', async () => {
                const dropdownButton = await findByTestAtrr(wrapper, '#dropdownMenuButton');
                await dropdownButton.simulate('click');
                const searchBox = await findByTestAtrr(wrapper, { placeholder: 'Find...' });
                await searchBox.simulate('click');
                await searchBox.simulate('KeyUp', {target  : { value : 'sanity'}});
                expect(componentInstance.state.filteredTestSuites).toEqual(['sanity']);
            });
        });
    });
    describe('Initialize build', () => {
        let buildButton, componentInstance, jsdomAlert, mockApi, mockAlert;
        beforeEach(async () => {
            jsdomAlert = window.alert; 
            window.alert = () => {};
            buildButton = findByTestAtrr(wrapper, '.submit-button');
            componentInstance = wrapper.instance();
            mockApi = jest.spyOn(API, 'getProjects');
            await mockApi.mockImplementation(() => Promise.resolve(['Test_Project'])); 
            mockAlert = jest.spyOn(window, 'alert');
        });
        afterEach(() => {
            window.alert = jsdomAlert;
        })
        it('Should not open the modal popup if projectName is not selected', () => {
            const mockModalShow = jest.spyOn(componentInstance, 'setModalShow');
            const mockAlert = jest.spyOn(window, 'alert');
            buildButton.simulate('click');
            expect(mockModalShow).not.toHaveBeenCalled();
            expect(mockAlert).toHaveBeenCalled();
        });
        it('Should not open the modal popup if testSuite is not selected', async () => {
            const select = await findByTestAtrr(wrapper, { name: 'projectName' });
            await select.simulate('change', {target  : { name :  'projectName',value : 'Test_Project'}});
            const mockModalShow = jest.spyOn(componentInstance, 'setModalShow');
            buildButton.simulate('click');
            expect(mockModalShow).not.toHaveBeenCalled();
            expect(mockAlert).toHaveBeenCalled();
        });
        it('Should open the modal popup', async () => {
            const mockGetProjectTags = jest.spyOn(API, 'getProjectTags');
            await mockGetProjectTags.mockImplementation(() => Promise.resolve(['sanity','regression'])); 
            const select = await findByTestAtrr(wrapper, { name: 'projectName' });
            await select.simulate('change', {target  : { name :  'projectName',value : 'Test_Project'}});
            const checkboxSelected = await findByTestAtrr(wrapper, { value: 'sanity' });
            await checkboxSelected.simulate('change', {target  : { name :  'testSuiteOption',value : 'sanity'}});
            const mockModalShow = jest.spyOn(componentInstance, 'setModalShow');
            buildButton.simulate('click');
            expect(mockModalShow).toHaveBeenCalled();
            expect(mockAlert).not.toHaveBeenCalled();
            expect(componentInstance.state.modalShow).toBe(true);
        });
    });
    describe('triggerBuild()', () => {
        let componentInstance, mockBuild;
        beforeEach(async () => {
            componentInstance = wrapper.instance();
            mockBuild = jest.spyOn(jenkinsApi, 'build');
        });
        it('Should update state as expected when build triggered successfully', () => {
            mockBuild.mockImplementation(() => Promise.resolve({status : 200}));
            const modalShow = componentInstance.state.modalShow;
            componentInstance.triggerBuild();
            expect(componentInstance.state.modalShow).toBe(!modalShow);
            expect(mockBuild).toHaveBeenCalled();
        });
        it('Should not update state when build triggere failed', () => {
            mockBuild.mockImplementation(() => Promise.reject({}));
            const modalShow = componentInstance.state.modalShow;
            componentInstance.triggerBuild();
            expect(componentInstance.state.modalShow).toBe(!modalShow);
            expect(mockBuild).toHaveBeenCalled();
        });
        it('Should call setInterval for 10000 sec', () => {
            componentInstance.triggerBuild();
            jest.advanceTimersByTime(10000);
            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);
        });
    });
    describe('getProgress()', () => {
        let componentInstance, mockGetBuildInfo;
        beforeEach(async () => {
            componentInstance = wrapper.instance();
            jest.advanceTimersByTime(2000);
            mockGetBuildInfo = jest.spyOn(jenkinsApi, 'getBuildInfo');
        });
        it('When build is already running progressStatus value should be info', async () => {
            await mockGetBuildInfo.mockImplementation(() => Promise.resolve({building : true, timestamp : 1567666704350, estimatedDuration : 172829}));
            await componentInstance.getProgress();
            expect(componentInstance.state.progressStatus).toEqual('info');
            expect(mockGetBuildInfo).toHaveBeenCalled();
        });
        it('When build is not running progressStatus value should not be info', async () => {
            await mockGetBuildInfo.mockImplementation(() => Promise.resolve({building : false, result : 'SUCCESS', number : 123}));
            await componentInstance.getProgress();
            //expect(componentInstance.state.progressStatus).toEqual('SUCCESS');
            expect(mockGetBuildInfo).toHaveBeenCalled();
        });
        it('When build is not running progressStatus value should not be info', async () => {
            await mockGetBuildInfo.mockImplementation(() => Promise.resolve({building : false, result : 'FAILURE', number : 123}));
            await componentInstance.getProgress();
            //expect(componentInstance.state.progressStatus).toEqual('FAILURE');
            expect(mockGetBuildInfo).toHaveBeenCalled();
        });
        it('When build is not running progressStatus value should not be info', async () => {
            await mockGetBuildInfo.mockImplementation(() => Promise.resolve({building : false, result : 'ABORTED', number : 123}));
            await componentInstance.getProgress();
            //expect(componentInstance.state.progressStatus).toEqual('ABORTED');
            expect(mockGetBuildInfo).toHaveBeenCalled();
        });
        it('When getBuildInfo rejects', async () => {
            await mockGetBuildInfo.mockImplementation(() => Promise.reject({}));
            await componentInstance.getProgress();
            expect(componentInstance.state.progressStatus).toEqual('info');
            expect(mockGetBuildInfo).toHaveBeenCalled();
        });
    });
});