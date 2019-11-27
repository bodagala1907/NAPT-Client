import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAtrr, testStore } from '../../testUtils/index';
import  AuthLogin  from './AuthLogin';
import { Carousel } from 'react-bootstrap';
import GoogleLogin from 'react-google-login';

let store;
const setUp = (initialState) => {
    store = testStore(initialState);
    const wrapper = shallow(<AuthLogin store={store}/>).childAt(0).dive();
    return wrapper;
};

describe('AuthLogin Component', () => { 
    let wrapper, componentInstance, jsdomAlert;
    beforeEach(() => {
        jsdomAlert = window.alert; 
        window.alert = () => {};
        const initialState = {
            user : null
        }
        wrapper = setUp(initialState);
        componentInstance = wrapper.instance();
    });
    afterEach(() => {
        window.alert = jsdomAlert;
        window.localStorage.removeItem('token');
    })
    it('Should render without error', () => {
        const carousel = findByTestAtrr(wrapper, Carousel);
        const carouselItems = findByTestAtrr(wrapper, Carousel.Item);
        const googleLogin = findByTestAtrr(wrapper, GoogleLogin);
        expect(carousel.length).toBe(1);
        expect(carouselItems.length).toBe(3);
        expect(googleLogin.length).toBe(1);
    });
    it('Should emit event responseGoogle when click on GoogleLogin button', () => {
        const carousel = findByTestAtrr(wrapper, Carousel);
        const carouselItems = findByTestAtrr(wrapper, Carousel.Item);
        const googleLogin = findByTestAtrr(wrapper, GoogleLogin);
        googleLogin.simulate('click');
        expect(carousel.length).toBe(1);
        expect(carouselItems.length).toBe(3);
        expect(googleLogin.length).toBe(1);
    });
    describe('GoogleLogin >>>' , () => {
        it('Login success', () => {
            const oldToken = window.localStorage.getItem('token');
            componentInstance.responseGoogle({profileObj : {email : 'vsaini@nisum.com'}, accessToken : 'token'});
            const newToken = window.localStorage.getItem('token');
            expect(oldToken).toEqual(null);
            expect(newToken).toEqual('token');
        });
        it('Login without nisum mail', async () => {
            const oldToken = await window.localStorage.getItem('token');
            await componentInstance.responseGoogle({profileObj : {email : 'vsaini@gmail.com'}, accessToken : 'token'});
            const newToken = await window.localStorage.getItem('token');
            expect(oldToken).toEqual(null);
            expect(newToken).toEqual(null);
        });
        it('Login fail', async () => {
            const oldToken = await window.localStorage.getItem('token');
            await componentInstance.responseGoogle({error : 'error'});
            const newToken = await window.localStorage.getItem('token');
            expect(oldToken).toEqual(null);
            expect(newToken).toEqual(null);
        });
    });
});