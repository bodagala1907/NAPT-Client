import { shallow } from 'enzyme';
import { testStore,findByTestAtrr, findByDataTestAtrr} from '../../testUtils/index';
import React from 'react';
import Home from './Home';
import { GoogleLogout } from 'react-google-login';
import Sidenav from '../sidenav/Sidenav';
import axios from 'axios';

let store;
const setUp = (initialState) => {
    store = testStore(initialState);
    const match = {path : '/app'}
    const wrapper = shallow(<Home store={store} match={match}/>).childAt(0).dive();
    return wrapper;
};
const data= {data : [{
    "title": "Project Summary Report",
    "path": "/kibana_project_summary",
    "root": "kibana_project_summary",
    "exact": true,
    "class" : "fa fa-bar-chart-o"
}]};

describe('App Component', () => {
    let wrapper, mockAxios;
    beforeEach(() => {
        const initialState = {
            user : {}
        }
        mockAxios = jest.spyOn(axios, 'get');
        wrapper = setUp(initialState);
    });
    it('Should render with 6 Routes', () => {
        const route = findByTestAtrr(wrapper, 'Route');
        const componentInstance = wrapper.instance();
        expect(route.length).toBe(6);
        expect(componentInstance.state.links).toEqual([]);
    });
    it('Should render with SideNav', () => {
        const sideNav = findByTestAtrr(wrapper, Sidenav);
        expect(sideNav.length).toBe(1);
    });
    it('Should render with GoogleLogout', () => {
        const googleLogout = findByTestAtrr(wrapper, GoogleLogout);
        expect(googleLogout.length).toBe(1);
    });
    describe('ComponentDidMount >>>', () => {
        it('Should fatch nav link data', async () => {
            const componentInstance = wrapper.instance();
            await mockAxios.mockImplementation(() => Promise.resolve(data));
            await componentInstance.componentDidMount();
            expect(mockAxios).toHaveBeenCalled();
            expect(componentInstance.state.links).toEqual(data.data);
        });
    });
    describe('GoogleLogout >>>', () => {
        beforeEach(() => {
            window.localStorage.setItem('token', 'token');
        });
        it('Should render logout button', async () => {
            const googleLogout = await findByTestAtrr(wrapper, GoogleLogout);
            await googleLogout.render();
            const span = await findByDataTestAtrr(googleLogout.shallow(), "google-signout");
            expect(span.length).toBe(1);
        });
        it('Should logout', async () => {
            const componentInstance = wrapper.instance();
            expect(window.localStorage.getItem('token')).toEqual('token');
            await componentInstance.logout();
            expect(window.localStorage.getItem('token')).toEqual(null);
        });
    })
    
})
