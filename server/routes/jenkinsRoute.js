const express = require('express');
const router = express.Router();
const jenkins = require('jenkins')({ baseUrl: 'http://nisum:nisum@localhost:8080', promisify : true });


router.get('/getInfo',(req,res) => {
    const jobName = req.query.job;
    const buildNumber = req.query.buildNumber;
    jenkins.build.get(jobName,buildNumber).then((data) => {
     res.send(data);
    });
});

router.post('/build',(req,res) => {
    const data = req.body.data;
   // console.log(data.name)
    jenkins.job.build({ name : data.name, parameters :data.parameters}).then((data) => {
       // console.log(data)
        res.send({});
    });
});


router.get('/getlog',(req,res) => {
    const jobName = req.query.job;
    const buildNumber = req.query.buildNumber;
    jenkins.build.log(jobName,buildNumber).then((data) => {
     res.send(data);
    });
});

module.exports = router;