import React from 'react';
import { shallow } from 'enzyme';
import Sidenav from './Sidenav';
import Links from '../../public/nav.json';
import { findByTestAtrr } from '../../testUtils/index'

const setUp = () => {
    const wrapper = shallow(<Sidenav links={Links}/>);
    return wrapper;
};

describe('App Component', () => { 
    let wrapper;
    beforeEach(() => {
        wrapper = setUp();
    });
    it('Should render with nav tag', () => {
        const component = findByTestAtrr(wrapper, 'nav');
        expect(component.length).toBe(1);
    });
    it('Should render with logo-section class', () => {
        const component = findByTestAtrr(wrapper, '.logo-section');
        expect(component.length).toBe(1);
    });
    it('Should render with ul', () => {
        const component = findByTestAtrr(wrapper, 'ul');
        expect(component.length).toBe(1);
    });
    it('Should render with 6 list-item', () => {
        const component = findByTestAtrr(wrapper, 'li');
        expect(component.length).toBe(6);
    })
});