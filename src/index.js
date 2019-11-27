import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'font-awesome/css/font-awesome.min.css';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';


const initialState = {
    user : null
}
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

const store = createStore(reducer , initialState ); // reducer and initial state  


ReactDOM.render(
    <Provider store={store}> 
        <App redirectUrl={window.location.pathname}/>
    </Provider>
    , document.getElementById('root') || document.createElement('div')
    );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
