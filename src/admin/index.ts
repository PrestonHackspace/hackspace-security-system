import express = require('express');
import bodyParser = require('body-parser');
import { MembersDb, Member } from '../members-db';

function NewAdminPanel(membersDb: MembersDb) {
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
      const newMember = req.body as Member;

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

export {
  NewAdminPanel,
};
