import App from './App';
import { shallow } from 'enzyme';
import { testStore } from '../testUtils/index';
import React from 'react';
import { Route } from 'react-router-dom';
import Home from './home/Home';
import  AuthLogin  from './googleLogin/AuthLogin';
import Axios from 'axios';

let pathMap = {};
let store;
const setUp = (initialState={user : null}, redirectUrl) => {
    store = testStore(initialState);
    const wrapper = shallow(<App store={store} redirectUrl={redirectUrl}/>).childAt(0).dive();
    pathMap = wrapper.find(Route).reduce((pathMap, route) => {
        const routeProps = route.props();
        pathMap[routeProps.path] = routeProps.component;
        return pathMap;
      }, {});
    return wrapper;
};


describe('App Component', () => {
    describe('App Component with user null', () => {

        let wrapper;
        beforeEach(() => {
            const initialState = {
                user : null
            }
            wrapper = setUp(initialState, '/login');
        });
    
        it('should not have Home route when user not logged in', () => {
            expect(pathMap['/app']).toBe(undefined);
        })
        it('should have AuthLogin route when user not logged in', () => {
            expect(pathMap['/login']).toBe(AuthLogin);
        })
        it('should redirect to /login url', () => {
            const classInstance = wrapper.instance();
            expect(classInstance.props.redirectUrl).toBe('/login');
        })

    });
    describe('App Component with user data', () => {

        let wrapper;
        beforeEach(() => {
            const initialState = {
                user : {data : {hd : 'nisum.com'}}
            }
            wrapper = setUp(initialState, '/app/execution');
        });
    
        it('should have Home route when user logged in', () => {
            expect(pathMap['/app']).toBe(Home);
        })
        it('should redirect to /app/execution url', () => {
            const classInstance = wrapper.instance();
            expect(classInstance.props.redirectUrl).toBe('/app/execution');
        })

    });
    describe('ComponentDidMount', () => {
        let wrapper, classInstance;
        let mockAxios; 
        beforeEach(() => {
            const initialState = {
                user : {}
            }
            wrapper = setUp(initialState, '/app/execution/');
            classInstance = wrapper.instance();
            mockAxios = jest.spyOn(Axios, "get");
        });

        it('Method should update the state when user logged in and having nisum mail', async () => {
            const data = {data : {hd : 'nisum.com'}};
            await mockAxios.mockImplementation(() => Promise.resolve(data)); 
            const oldState = store.getState();

            await classInstance.componentDidMount();
            const newState = store.getState();
           
            expect(oldState).toEqual({user : {}});
            expect(newState).toEqual({user : data.data});
            expect(mockAxios).toHaveBeenCalled();
        });
        it('Method should not update the state when user logged in and not having nisum mail', async () => {
            const data = {data : {hd : 'gmail.com'}};
            await mockAxios.mockImplementation(() => Promise.resolve(data)); 
            const oldState = store.getState();

            await classInstance.componentDidMount();
            const newState = store.getState();
           
            expect(oldState).toEqual({user : {}});
            expect(newState).toEqual(oldState);
            expect(mockAxios).toHaveBeenCalled();
        });
        it('Method should not update the state when user is not logged in', async () => {
            await mockAxios.mockImplementation(() => Promise.reject({})); 
            const oldState = store.getState();

            await classInstance.componentDidMount();
            const newState = store.getState();
           
            expect(oldState).toEqual({user : {}});
            expect(newState).toEqual(oldState);
            expect(mockAxios).toHaveBeenCalled();
        });
    })
})
