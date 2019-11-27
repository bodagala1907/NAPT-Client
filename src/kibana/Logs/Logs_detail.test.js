import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAtrr } from '../../../testUtils/index';
import Kibana_detail from './Kibana_detail';

const setUp = () => {
    const wrapper = shallow(<Kibana_detail/>);
    return wrapper;
};

describe('Kibana_detail Component', () => { 
    let wrapper;
    beforeEach(() => {
        wrapper = setUp();
    });
    it('Should render without error', () => {
        const iframe = findByTestAtrr(wrapper, 'iframe');
        expect(iframe.length).toBe(1);
    });
});