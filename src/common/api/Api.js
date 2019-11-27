import axios from 'axios';

const endPoint = process.env.NODE_ENV === 'production'?
                (process.env.REACT_APP_PROD === 'prod' ? 'http://localhost:3000/api/' : 'http://localhost:3000/api/') :
                'http://localhost:3000/api/';

export function getProjects(moduleName) {
    console.log(endPoint);
    return axios.get(endPoint + 'getProjects?moduleName='+ moduleName)
     .then((res) => {
        console.log(res.data)
        if(res.data)
            return res.data;
        else
        return [];
     })
     .catch((err) => {
        console.log(err);
     })
}
export function getModules() {
   console.log(endPoint);
   return axios.get(endPoint + 'getModules')
    .then((res) => {
       console.log(res.data)
       if(res.data)
           return res.data;
       else
       return [];
    })
    .catch((err) => {
       console.log(err);
    })
}
export function getProjectTags(projectname,moduleName) {
    return axios.get(endPoint + 'getProjectTags?projectName='+projectname+'&moduleName='+moduleName)
    .then((res) => {
       return res.data;
    })
    .catch((err) => {
       console.log(err);
    })
}