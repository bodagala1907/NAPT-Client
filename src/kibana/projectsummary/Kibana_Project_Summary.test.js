import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAtrr } from '../../../testUtils/index';
import Kibana_Project_Summary from './Kibana_Project_Summary';

const setUp = () => {
    const wrapper = shallow(<Kibana_Project_Summary/>);
    return wrapper;
};

describe('Kibana_Project_Summary Component', () => { 
    let wrapper;
    beforeEach(() => {
        wrapper = setUp();
    });
    it('Should render without error', () => {
        const iframe = findByTestAtrr(wrapper, 'iframe');
        expect(iframe.length).toBe(1);
    });
});