import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAtrr } from '../../../testUtils/index';
import Fail_report from './Fail_report';

const setUp = () => {
    const wrapper = shallow(<Fail_report/>);
    return wrapper;
};

describe('Fail_report Component', () => { 
    let wrapper;
    beforeEach(() => {
        wrapper = setUp();
    });
    it('Should render without error', () => {
        const iframe = findByTestAtrr(wrapper, 'iframe');
        expect(iframe.length).toBe(1);
    });
});