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

  app.get('/', async (req, res) => {
    const members = await membersDb.getAllMembers();

    res.render('index', { members });
  });

  app.post('/', async (req, res) => {
    const newMember = req.body as Member;

    await membersDb.addMember(newMember);

    res.redirect('/');
  });

  app.get('/:cardId/delete', async (req, res) => {
    const { cardId } = req.params;

    await membersDb.deleteByCardId(cardId);

    return res.redirect('/');
  });

  app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
  });
}

export {
  NewAdminPanel,
};
