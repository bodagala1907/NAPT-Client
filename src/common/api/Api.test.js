import {getProjects , getProjectTags} from './Api';
import Axios from 'axios';

describe('Api test', () => { 
    let mockAxios;
    beforeEach(() => {
        jest.resetModules() 
        mockAxios = jest.spyOn(Axios, "get");
    })
    describe('getProjects()', () => {
        it('getProjects() should return expected data', async () => {
            const data = {data :  ["API_Test"]}
            await mockAxios.mockImplementation(() => Promise.resolve(data)); 
            const projects = await getProjects();
            expect(projects).toEqual(data.data);
        });
        it('getProjects() should return [] ', async () => {
            const data = {}
            await mockAxios.mockImplementation(() => Promise.resolve(data)); 
            const projects = await getProjects();
            expect(projects).toEqual([]);
        });
        it('getProjects() should not return anything ', async () => {
            await mockAxios.mockImplementation(() => Promise.reject({})); 
            const projects = await getProjects();
            expect(projects).toEqual(undefined);
        });
    });
    describe('getProjectTags()', () => {
        it('getProjectTags() should return expected data', async () => {
            const data = {data :  ["sanity"]}
            await mockAxios.mockImplementation(() => Promise.resolve(data)); 
            const projects = await getProjectTags();
            expect(projects).toEqual(data.data);
        });
        it('getProjectTags() should not return anything ', async () => {
            await mockAxios.mockImplementation(() => Promise.reject({})); 
            const projects = await getProjectTags();
            expect(projects).toEqual(undefined);
        });
    });
});