import React from 'react';
import {ProgressBar, ButtonToolbar} from 'react-bootstrap';
import './Dashboard.scss';
import Execution from '../execution/Execution';
import ModalPopup from '../common/modal/Modal';
import * as API from '../common/api/Api';
import { getBuildInfo, build } from '../common/jenkins-utils/Utils';

const Brands = require('../jsons/brands.json');
const Parameters = require('../jsons/parameters.json');
const ref = React.createRef();
let interv;
let buildRequestParams;

class Dashboard extends React.Component{  
   constructor(props){
      super(props);
      this.state = {
         progress: 0, 
         submitted : false, 
         progressStatus : 'info', 
         currentBuildNumber : 0,
         params : {
            module : 'Select Module',
            projectName : 'Select project',
            testEnv: Parameters['testEnv'][0],
            testSuiteType: 'Select test suite',
            browser : Parameters['testCaseType'][0] === 'UI' ? Parameters['browser'][0] : 'NA',
            os : Parameters['os'][Parameters['testCaseType'][0]][0],
            testCaseType : Parameters['testCaseType'][0],
            threadCount : Parameters['threadCount'][0],
            release : Parameters['release'][0],
            email : '',
            webURL : Brands[Parameters['testEnv'][0]]
         },
         progressLabel : 'getting info...',
         renderInfo : true,
         modalShow : false,
         projects : [],
         selectData : [],
         filteredTestSuites: [],
         testSuites:[],
         modules: []
      };
      
   }
   setFormData = (event) => {
      //console.log(event.target.value)
      const eventTargetName = event.target.name;
      const eventTargetValue = event.target.value;
      console.log(eventTargetName, eventTargetValue)
      if(eventTargetName === 'testEnv') {
         this.setState({
            params: {
               ...this.state.params, 
               [eventTargetName] : eventTargetValue, 
               webURL : Brands[eventTargetValue],

            }
          },() => {
            console.log(this.state)
          });
      }
      else if(eventTargetName === 'testCaseType') {
         const os = Parameters['os'][eventTargetValue][0];
         const browser = eventTargetValue === 'UI' ? 'Chrome' : 'NA';
         this.setState({
            params: {...this.state.params, 
               [eventTargetName] : eventTargetValue,
               os ,
               browser
            }
          },() => {
            this.setState({
               selectData : [],
               testSuites : [],
               filteredTestSuites: [],
               params: {
                  ...this.state.params, 
                  projectName: 'Select project',
                  testSuiteType: 'Select test suite'
               }
            });
          });
      }
      else if(eventTargetName === 'projectName') {
         this.setState({
            selectData: [],
            testSuites : [],
            filteredTestSuites: [],
            params: {...this.state.params, 
               [eventTargetName] : eventTargetValue
            }
          },() => {
            API.getProjectTags(this.state.params.projectName, this.state.params.module).then((res) => {
               // console.log(res);
               this.setState({
                  testSuites : res,
                  filteredTestSuites : res,
                  params: {
                     ...this.state.params, 
                     testSuiteType: 'Select test suite'
                  },
                  selectData : res.map((item) => { return {value : item, selected : false} })   //making the options for multiselect test suite type
               }, () => {
                   console.log(this.state)
               });
            })
            .catch((err) => {
               console.log(err);
            })
          });
      }
      else if(eventTargetName === 'module') {
         this.setState({
            selectData: [],
            testSuites : [],
            filteredTestSuites: [],
            params: {...this.state.params, 
               [eventTargetName] : eventTargetValue
            }
          },() => {
            API.getProjects(this.state.params.module).then((res) => {
               // console.log(res);
               this.setState({
                  projects : res,
                  params: {
                     ...this.state.params, 
                     projectName: 'Select project',
                     testSuiteType: 'Select test suite'
                  }  
               }, () => {
                   console.log(this.state)
               });
            })
            .catch((err) => {
               console.log(err);
            })
          });
      }
      else {
         this.setState({
            params: {...this.state.params, 
               [eventTargetName] : eventTargetValue
            }
          },() => {
            // console.log(this.state)
          });
      }
      
   }
   async componentDidMount() {
      API.getModules().then((res) => {
         // console.log(res);
         this.setState({
            modules : res,
            params : {
               ...this.state.params,
               module : res[0]
            }
         },() => {
            API.getProjects(this.state.params.module).then((res1) => {
               this.setState({
                  projects : res1
               });
            });
         });
      })
      .catch((err) => {
         console.log(err);
      });
  
      getBuildInfo('AutomationExecutionEngine', 'lastBuild')
      .then((res) => {
         if(res.building === true) {
            this.setState({submitted : true}, () => {
               this.getProgress();
            });
         }
      }).catch((err) => console.log(err));

   }
   checkTestSuite = (event) => {
      const newData = this.state.selectData.map((item) => {
         if(item.value === event.target.value) {
            return {value : event.target.value , selected : !item.selected};
         }
         else {
            return item;
         }
      })
      this.setState({
         selectData :  newData
      }, () => {
         const selectedTestSuites = this.state.selectData.map((item) => {
            return item.selected ? item.value : null
         });
         this.setState({
            params: {...this.state.params, 
               testSuiteType : selectedTestSuites.toString().split(',').filter((item) => item !== '').toString()
            }
          },() => {
           // console.log("checked suites",this.state.params.testSuiteType.length)
            if(this.state.params.testSuiteType.length < 1) {
               this.setState({
                  params : {
                     ...this.state.params,
                     testSuiteType : 'Select test suite'
                  }
               })
            }
          });
      })
   }
   searchTestSuite = (event) => {
      const value = event.target.value;
      this.setState({
         filteredTestSuites : this.state.testSuites.filter((item) => {
            return item.includes(value);
         })
      },() => {
         console.log(this.state.testSuites)
      })
   }

   removeTestSuite =(item) => {
      const testSuites = this.state.params.testSuiteType.split(",").filter((item1) => {
         return item1 !== item;
      });
      this.setState({
         selectData : this.state.selectData.map((item1) => {
            if(item1.value === item) {
               item1.selected = !item1.selected  
            }
             return item1;
         }),
         params : {
            ...this.state.params,
            testSuiteType : testSuites.toString() === "" ? 'Select test suite' : testSuites.toString()
         }
      }, () => {
         console.log(this.state.selectData)
      })
   }

   render(){
      const modules = this.state.modules;
      const testCaseTypes = Parameters && Parameters['testCaseType'];
      const projects = this.state.projects && this.state.projects.filter((project) => {
         return project && project.toLowerCase().includes(this.state.params.testCaseType.toLowerCase())
      });
      const testSuites = this.state.filteredTestSuites;
      
       return(
           <div>
            <h3 className="top-heading">Execution Engine</h3>
            <div className="container mt-4">
               <div className="row Project-info">
                  <div className="col-6 row">
                     <div className="col-5  projectclassName">
                        <label >Test Interface:</label>
                     </div>
                     <div className="col-7">
                        <select
                              name="testCaseType" 
                              className="form-control" 
                              value={this.state.params.testCaseType}
                              onChange={this.setFormData}>
                                 {testCaseTypes && testCaseTypes.map((testCaseType,index) => {
                                    return (
                                       <option key={index}>{testCaseType}</option>
                                    )
                              })}
                        </select>
                     </div>
                  </div>
                  <div className="col-6 row">
                     <div className="col-5">
                        <label >Module:</label>
                     </div>
                     <div className="col-7">
                        <select
                        name="module" 
                        className="form-control" 
                        value={this.state.params.module}
                        onChange={this.setFormData}>
                           {modules && modules.map((item,index) => {
                              return (
                                 <option key={index}>{item}</option>
                              )
                           })}
                        </select>
                     </div>
                  </div>
                  </div>
                  <div className="row Project-info">
                     <div className="col-6 row">
                        <div className="col-5">
                           <label>Project Name:</label>
                        </div>
                        <div className="col-7">
                           <select
                           name="projectName" 
                           className="form-control" 
                           value={this.state.params.projectName}
                           onChange={this.setFormData}>
                              <option key="projectName" disabled selected>Select project</option>
                              {projects && projects.map((project, index) => {
                                 return (
                                    <option key={index}>{project}</option>
                                 )
                              })}
                           </select>
                        </div>
                     </div>
                     
                     <div className="col-6 row">
                        <div className="col-5 projectclassName">
                           <label >Test Suite :</label>
                        </div>
                        <div className="col-7">
                           <div className="d-flex dropdown form-control-custom justify-content-between"  multiple="multiple">
                           <div className="d-flex flex-wrap">
                              {
                                 this.state.params.testSuiteType.split(',').map((item) => {
                                 return (
                                    item === 'Select test suite' ? 
                                    (<div key={item}>{item}</div>) :
                                    (<div key={item} className="item-chip">{item}<i className="fa fa-times" aria-hidden="true" onClick={() => this.removeTestSuite(item)}></i></div>)
                                 )
                                 })}
                              </div>
                              <span 
                              className="dropdown-toggle" 
                              id="dropdownMenuButton" 
                              data-toggle="dropdown" 
                              >
                              </span>
                              <div className="dropdown-menu dropdown-menu-right col pt-0 mt-0 border-top-0" aria-labelledby="dropdownMenuButton">
                                 <input type="text" className="form-control" placeholder="Find..." onKeyUp={this.searchTestSuite}/>
                                 <ul className="col multi-select-list">
                                 {testSuites && testSuites.map((testSuiteType,index) => {
                                    return  (
                                       <li key={index} className="dropdown-item pr-0 pl-0">
                                          <input 
                                          className="check-box"
                                          type="checkbox" 
                                          name="testSuiteOption"
                                          onChange={this.checkTestSuite} 
                                          value={testSuiteType} 
                                          id={'testSuite-'+index}
                                          />
                                          <label className="col m-0" for={'testSuite-'+index}>{testSuiteType}</label>
                                       </li>
                                    ) 
                                 })}
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="row Project-info">
                     <div className="col-6 row">
                        <div className="col-5 projectclassName">
                           <label >Test Environment:</label>
                        </div>
                        <div className="col-7">
                           <select
                           name="testEnv" 
                           className="form-control" 
                           value={this.state.params.testEnv}
                           onChange={this.setFormData}>
                              {Parameters && Parameters['testEnv'].map((testEnv,index) => {
                                 return (
                                    <option key={index}>{testEnv}</option>
                                 )
                              })}
                           </select>
                        </div>
                     </div>
                     <div className="col-6 row">
                        <div className="col-5  projectclassName">
                           <label >Thread Count:</label>
                        </div>
                        <div className="col-7">
                           <select
                                 name="threadCount" 
                                 className="form-control" 
                                 value={this.state.params.threadCount}
                                 onChange={this.setFormData}>
                                    {Parameters && Parameters['threadCount'].map((threadCount,index) => {
                                       return (
                                          <option key={index}>{threadCount}</option>
                                       )
                                 })}
                           </select>
                        </div>
                     </div>
                  </div>
                  <div className="row Project-info">
                     <div className="col-6 row">
                        <div className="col-5 projectclassName">
                           <label >Browser:</label>
                        </div>
                        <div className="col-7">
                           <select
                                 disabled={(this.state.params.testCaseType !== 'UI') ? true : false}
                                 name="browser" 
                                 className="form-control" 
                                 value={this.state.params.browser}
                                 onChange={this.setFormData}>
                                    {Parameters && Parameters['browser'].map((browser,index) => {
                                       return (
                                          <option key={index}>{browser}</option>
                                       )
                                 })}
                           </select>
                        </div>
                     </div>
                     <div className="col-6 row">
                        <div className="col-5  projectclassName">
                           <label >OS:</label>
                        </div>
                        <div className="col-7">
                           <select
                                 disabled={(this.state.params.testCaseType === 'API') ? true : false}
                                 name="os" 
                                 className="form-control" 
                                 value={this.state.params.os}
                                 onChange={this.setFormData}>
                                    {Parameters && Parameters['os'][this.state.params.testCaseType].map((os,index) => {
                                       return (
                                          <option key={index}>{os}</option>
                                       )
                                 })}
                           </select>
                        </div>
                     </div>
                  </div>
                  <div className="row Project-info">
                  <div className="col-6 row">
                     <div className="col-5">
                        <label >Release:</label>
                        </div>
                        <div className="col-7">
                           <select
                           name="release" 
                           className="form-control" 
                           value={this.state.params.release}
                           onChange={this.setFormData}>
                              {Parameters && Parameters['release'].map((release,index) => {
                                 return (
                                    <option key={index}>{release}</option>
                                 )
                              })}
                           </select>
                     </div>
                  </div>
                  <div className="col-6 row">
                   
                  </div>
                  </div>
                  <div className="row Project-info">
                     <div className="col-6 row">
                        <div className="col-5  projectclassName">
                           <label >Email Id:</label>
                        </div>
                        <div className="col-7">
                           <input 
                           type="text" 
                           name="email" 
                           className="form-control" 
                           value={this.state.params.email}
                           onChange={this.setFormData}></input>
                        </div>
                     </div>
                     <div className="col-6 row">
                        <div className="col-5  projectclassName">
                           
                        </div>
                        <div className="col-7">
                              <button 
                              type="button" 
                              className="btn submit-button" 
                              onClick={this.initializeBuild} 
                              disabled = {this.state.submitted && this.state.progressStatus === 'info'}>
                                 {this.state.submitted && this.state.progressStatus === 'info' ? (<b>Building...</b>) : (<b>Build</b>)}
                              </button>
                        </div>
                     </div>
                  </div>
                  <div className="row Project-info">
                     <div className="offset-3 col-5 pb-height text-right">
                        {this.state.submitted && this.state.progressStatus === 'info' &&
                        (<ProgressBar animated now={this.state.progress} label={`${this.state.progressLabel}`} />)
                        }
                     </div>
                  </div>
                  
                  <ButtonToolbar>
                     <ModalPopup
                     show={this.state.modalShow} 
                     onHide={this.setModalShow} 
                     params = {this.state.params}
                     onBuildButtonClick= {this.triggerBuild}/>
                  </ButtonToolbar>
            </div>
            <Execution ref={ref}/>
         </div>
             
       )
   }
   setModalShow= () => {
      this.setState({
         modalShow : !this.state.modalShow,
      })
      const testSuite = this.state.params.testSuiteType.split(',').map((item) => '@'+ item  ).toString();
      buildRequestParams = {
         ...this.state.params, 
         testSuiteType : testSuite, 
         OS : this.state.params.os,
         browserName : this.state.params.browser
      }
   }

   getProgress = () => {
      console.log('inside progress', this.state)
      interv = setInterval(() => {
         getBuildInfo('AutomationExecutionEngine', 'lastBuild')
         .then((res) => {
           const data = res.data;
            this.setState({
               currentBuildNumber : data.number
            });
            if(data.building !== true) {
               console.log("build completed",this.state)
               if(data.result === 'ABORTED') {
                  clearInterval(interv);
                  interv = 0;
                  this.setState({submitted : true, progressStatus : 'ABORTED'})
                  ref.current.reRenderInfo();
               }
               if(data.result === 'SUCCESS') {
                  clearInterval(interv);
                  interv = 0;
                  this.setState({submitted : true, progressStatus : 'SUCCESS'})
                  ref.current.reRenderInfo();
               }
               if(data.result === 'FAILURE') {
                  clearInterval(interv);
                  interv = 0;
                  this.setState({submitted : true, progressStatus : 'FAILURE'});
                  ref.current.reRenderInfo();
               }
            }
               
            if(this.state.progress > 95) {
               this.setState({progress: 100,progressLabel : 'almost complete'});
            }
            else {
               this.setState({
                  progress : Math.round((new Date().getTime() - data.timestamp)/ 
                  data.estimatedDuration*100) ,
                  progressLabel : Math.round((new Date().getTime() - data.timestamp)/ 
                  data.estimatedDuration*100) + ' %' ,
               }) 
            }
         }).catch((err) => console.log(err));
      }, 2000);   
   }
   initializeBuild = () => {
      if(this.state.params.projectName !== 'Select project' && this.state.params.testSuiteType !== 'Select test suite' && this.state.params.projectName !== '' && this.state.params.testSuiteType !== '') {
         this.setState({
            progress: 0, 
            progressStatus : 'info', 
            currentBuildNumber : 0,
            progressLabel : 'getting info...',
            submitted : false
         },() => {
            this.setModalShow();
         });
      }
      else {

         this.state.params.projectName === 'Select project' || this.state.params.projectName === '' ? alert('Please select Project') : alert('Please select TestSuite')
      }
      
   }
   triggerBuild = () => {
      this.setState({modalShow : !this.state.modalShow})
      build('AutomationExecutionEngine', buildRequestParams)
      .then(() => {
         setTimeout(() => {
            this.getProgress();
         },10000);
         this.setState({submitted : true});
      })
      .catch((err) => {
         this.setState({submitted : false});
         throw err;
      });
      
   }
   componentWillUnmount() {
      clearInterval(interv);
      interv = 0;
   }
}
export default Dashboard;
