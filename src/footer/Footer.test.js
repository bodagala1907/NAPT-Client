import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAtrr } from '../../testUtils/index'
import Footer from './Footer';

const setUp = () => {
    const wrapper = shallow(<Footer/>);
    return wrapper;
};

describe('App Component', () => { 
    let wrapper;
    beforeEach(() => {
        wrapper = setUp();
    });
    it('Should render with footer class', () => {
        const component = findByTestAtrr(wrapper, '.footer');
        expect(component.length).toBe(1);
    });
});