import React, { Component } from 'react'
import { connect } from 'react-redux';
import './App.scss';
import Home from './home/Home';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import AuthLogin from './googleLogin/AuthLogin';
import axios from 'axios';

const mapStateToProps = (state) => {
  console.log(state)
  return {
    user : state.user
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
      addUser : (value) => {
      dispatch({
          type : "ADD_USER",
          payload : value
      })
      }
  }
}
export class App extends Component {

  componentDidMount() {
    const token = localStorage.getItem('token');
    axios.get('https://www.googleapis.com/oauth2/v1/userinfo?access_token='+token)
    .then(res => {
      if(res.data.hd === 'nisum.com') {
        this.props.addUser(res.data);
      }
    })
    .catch(() => {
      console.log('Please login with Nisum mail');
    })
    console.log(token)
  }

  render() {
    const redirectUrl = this.props.redirectUrl.includes('/app/') ? this.props.redirectUrl : '/app/execution';
    return (
      <BrowserRouter>
          <React.Fragment>
            <Route path="/login" component={AuthLogin}/>
            {this.props.user && <Route path="/app" component={Home}/>}
            {this.props.user ? (<Redirect to={redirectUrl} />) : (<Redirect to="/login" />)}
          </React.Fragment>
        </BrowserRouter>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
