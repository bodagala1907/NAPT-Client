import React, { Component } from "react";
import axios from 'axios';
import { Route } from 'react-router-dom'
import { connect } from 'react-redux';
import { GoogleLogout } from 'react-google-login';
import "./Home.scss";

import Sidenav from "../sidenav/Sidenav";
import Dashboard from '../dashboard/Dashboard';
import Kibana_summary from "../kibana/recentsummary/Kibana_summary";
import Kibana_detail from "../kibana/detailreport/Kibana_detail";
import Fail_report from "../kibana/failreport/Fail_report";
import Footer from "../footer/Footer";
import VMManagement from "../VMManagement/VMManagement";
import Kibana_Project_Summary from "../kibana/projectsummary/Kibana_Project_Summary";
import Logs_detail from "../kibana/Logs/Logs_detail";


const mapStateToProps = (state) => {
  console.log("state",state)
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

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [],
      title: ""
    };
  }
  componentDidMount() {
    axios.get('../nav.json')
      .then(res => {
        this.setState({ links: res.data })
       
      })
  }
  logout =() => {
    this.props.addUser(null);
    localStorage.removeItem('token');
    console.log("logged out")
  }
  render() {
    const { match } = this.props
    return (
      
      <React.Fragment>
        <div className="d-flex">
          <div className="sidenav pr-0"> 
            <Sidenav links={this.state.links} />
          </div>
          <div className="p-0 full-width-container">
            <div className="row top-header m-0">
              <div className="col-10 text-center">
                  <h2 className="h-line-height h-color m-0 bold">Nisum Automation Platform (NAPT)</h2>    
              </div>
              <div className="col-2 text-right pl-0">
                {this.props.user && <span className="h-line-height h-color"><i className="fa fa-user mr-1" aria-hidden="true"></i>{this.props.user.name}</span> }
                <span className="logout h-line-height">
                <i className="fa fa-sign-out" aria-hidden="true"></i>
                <GoogleLogout
                    clientId="238912929990-7jb8idusue8jjns5s0dqs4jq67behtng.apps.googleusercontent.com"
                    buttonText="Logout"
                    onLogoutSuccess={this.logout}
                    render={renderProps => (
                      <span onClick={renderProps.onClick} data-test="google-signout">Sign out</span>
                    )}
                  >
                </GoogleLogout>
               </span>
              </div> 
            </div>
            
            <div className="main-content"> 
              <Route path={`${match.path}/execution`} component={Dashboard} />
              <Route path={`${match.path}/kibana_summary`} component={Kibana_summary} />
              <Route path={`${match.path}/kibana_project_summary`} component={Kibana_Project_Summary} />
              <Route path={`${match.path}/kibana_detail`} component={Kibana_detail} />
              <Route path={`${match.path}/fail_report`} component={Fail_report} />
              <Route path={`${match.path}/Logs_detail`} component={Logs_detail} />
              <Route path={`${match.path}/vm_management`} component={VMManagement} />
              <Footer/>
            </div>
          </div> 
        </div>
      </React.Fragment>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
