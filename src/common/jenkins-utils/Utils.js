import axios from 'axios';
const jenkins = require('jenkins')({ baseUrl: 'http://nisum:nisum@localhost:8080', promisify : true });


export function  getBuildInfo(jobName, buildNumber) {
    return axios.get('http://localhost:3000/api/jenkins/getInfo?job='+jobName+'&buildNumber='+buildNumber,(res) => {
       // console.log(res);
        return  res;
    })
   
}
 export function getAllJobs() {
     return jenkins.job.list();
 }

 export function build(name, parameters) {
     return jenkins.job.build({ name, parameters});
 }

//export function build(name, parameters) {
  //  return axios.post('http://localhost:3000/api/jenkins/build',{data : {name,parameters}},(res) => {
       // console.log(res);
   //     return  res;
    //})
   
//}

// export function getConsoleOutput(jobName, buildNumber) {
//     return jenkins.build.log(jobName, buildNumber);
// }


export function getConsoleOutput(jobName, buildNumber) {
    return axios.get('http://localhost:3000/api/jenkins/getlog?job='+jobName+'&buildNumber='+buildNumber,(res) => {
       // console.log(res);
        return  res;
    })
    
}