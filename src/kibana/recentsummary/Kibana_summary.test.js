import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAtrr } from '../../../testUtils/index';
import Kibana_summary from './Kibana_summary';

const setUp = () => {
    const wrapper = shallow(<Kibana_summary/>);
    return wrapper;
};

describe('Kibana_summary Component', () => { 
    let wrapper;
    beforeEach(() => {
        wrapper = setUp();
    });
    it('Should render without error', () => {
        const iframe = findByTestAtrr(wrapper, 'iframe');
        expect(iframe.length).toBe(1);
    });
});