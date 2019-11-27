const express = require('express');
const router = express.Router();
const parseString = require('xml2js').parseString;
const fs = require('fs');
const path = require('path');
const findInFiles = require('find-in-files');

router.get('/getModules', (request, response, next) => { 
    console.log(path);
	console.log("dsdsddsdsd************************");
	const jsonPath = path.join(__dirname, '../../../TLRD_Automation/pom.xml');
	console.log(__dirname);
    console.log(jsonPath);
    fs.readFile( jsonPath, function(err, data) {
        if(err) {
            response.status(404).send({status : err})
        }
        if(data) {
            parseString(data, function (err, result) {
                if(err) {
                    response.status(404).send({status : err});
                }
                else {
                    let modules = result.project.modules[0].module.map((item) => {
                        return item.split('/')[0];
                    });
                    modules = modules.filter((item) => {
                        return item !=='Central';
                    })
                    response.send([...new Set(modules)]);
                }
            });
        }
     });
});
router.get('/getProjects', (request, response, next) => { 
    const moduleName = request.query.moduleName;
    const jsonPath = path.join(__dirname, '../../../TLRD_Automation/pom.xml');
    console.log(jsonPath);
    fs.readFile( jsonPath, function(err, data) {
        if(err) {
            response.status(404).send({status : err})
        }
        if(data) {
            parseString(data, function (err, result) {
                if(err) {
                    response.status(404).send({status : err});
                }
                else {
                    let modules = result.project.modules[0].module.filter((item) => {
                        return item.toLowerCase().includes(moduleName.toLowerCase());
                    });
                    modules = modules && modules.map((item) => {
                        return item && item.split('/')[1];
                    });
                    response.send([...new Set(modules)]);
                }
            });
        }
     });
});
router.get('/getProjectTags', (request, response, next) => {
     console.log(request.query.projectName);
     const jsonPath = path.join(__dirname, '../../../TLRD_Automation/'+request.query.moduleName+'/'+request.query.projectName);
    //const jsonPath = path.join(__dirname, 'C:/Users/NB171/Downloads/Auto_Execution/TLRD_Automation/ActiveOmni/API_TMW_TLRD');
    findInFiles.findSync(" @", jsonPath, '.feature$')
    .then(function(results) {
        // console.log(results)
        let tags = [];
        for (var result in results) {
            var res = results[result];
            tags = tags.concat(res.line);
        }
        const tags1 = tags
            .toString()
            .split(' ')
            .filter((item) => item !== '')
            .map((item) => {
                if(item.charAt(item.length-1) === ',') {     ///// Removing '@' and ','
                    return item.slice(1,item.length-1)
                }
                else {
                    return item.slice(1,item.length)
                } 
            });
        uniqTags = [...new Set(tags1)];
        //console.log(uniqTags)
        response.send(uniqTags);
    }).catch(() => {
        response.status(404).send({});
    });
})

module.exports = router;