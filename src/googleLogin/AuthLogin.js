import React, { Component } from 'react'
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';
import {Carousel} from 'react-bootstrap';

import image1 from '../assets/Automation1.jpg';
import image2 from '../assets/chartsReport.jpg';
import image3 from '../assets/Devops.png';
import loginImage from '../assets/login-icon.png'
import './AuthLogin.scss'

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

export class AuthLogin extends Component {

    responseGoogle = (response) => {
        console.log("login response",response)
        if(response.profileObj) {
            if(response.profileObj.email.includes('@nisum.com')) {
                localStorage.setItem('token', response.accessToken);
                this.props.addUser(response.profileObj);
                console.log(response);
            }
            else {
                alert('please login with nisum mail')
            }
        }  
    }

    render() {
        return (
            <div>
                <Carousel>
                    <Carousel.Item>
                    <img
                        className="d-block"
                        src={image1}
                        alt="Third slide"
                        />

                        <Carousel.Caption>
                        <h3>Nisum Automation Platform</h3>
                        <p>NAPT provides UI / API scripts seamless execution and generates customized reports.</p>
                        
                        </Carousel.Caption>
                    </Carousel.Item>
                    
                    <Carousel.Item>
                        <img
                        className="d-block"
                        src={image2}
                        alt="Third slide"
                        />

                        <Carousel.Caption>
                        <h3>Reports</h3>
                        <p>Nisum Automation Execution Engine provides wide range of current reports, historical reports, detailed summary reports …. etc</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                    <img
                        className="d-block"
                        src={image3}
                        alt="First slide"
                        />
                        <Carousel.Caption>
                        <h3>CI / CD </h3>
                        <p>Pipeline Automation</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    </Carousel>
                <div className="d-inline-block login">
                <h3 className="login-header">
                    <div className="d-inline-block mr-2">
                        <img
                            className="login-icon"
                            src={loginImage}
                            alt="icon"
                            />
                    </div>
                    NAPT
                </h3>
                <div className="google-login-btn">
                    <GoogleLogin
                        clientId="238912929990-7jb8idusue8jjns5s0dqs4jq67behtng.apps.googleusercontent.com"
                        buttonText="Sign In With Google"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
                
                </div>
                    
            </div>
                
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AuthLogin);
