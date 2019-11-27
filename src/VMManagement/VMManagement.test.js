import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAtrr } from '../../testUtils/index';
import VMManagement from './VMManagement';
const setUp = () => {
    const wrapper = shallow(<VMManagement/>);
    return wrapper;
};

describe('VMManagement Component', () => { 
    let wrapper;
    beforeEach(() => {
        wrapper = setUp();
    });
    it('Should render without error', () => {
        const iframe = findByTestAtrr(wrapper, 'div');
        expect(iframe.length).toBe(1);
    });
});