import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

export const findByTestAtrr = (component, attr) => {
    const wrapper = component.find(attr);
    return wrapper;
};
export const findByDataTestAtrr = (component, attr) => {
    const wrapper = component.find(`[data-test='${attr}']`);
    return wrapper;
};

export const testStore = (initialState) => {
    const middlewares = [ReduxThunk];
    const reducer = (state = initialState , action) => {
        switch (action.type) {
            case "ADD_USER" :
                state = {...state , user: action.payload}
                break;
            default :
                state = {...state}
        }
        return state;
    }
    const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore)

    return createStoreWithMiddleware(reducer, initialState);
};