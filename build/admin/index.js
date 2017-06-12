"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
function NewAdminPanel(membersDb) {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'js');
    app.engine('js', require('express-react-views').createEngine());
    app.all('/', (req, res) => {
        if (req.method === 'POST') {
            const newMember = req.body;
            membersDb.addMember(newMember);
        }
        const members = membersDb.getAllMembers();
        members.then((members) => {
            res.render('index', { members });
        });
    });
    app.listen(3000, () => {
        console.log('Example app listening on port 3000!');
    });
}
exports.NewAdminPanel = NewAdminPanel;
