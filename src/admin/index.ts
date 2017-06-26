import express = require('express');
import bodyParser = require('body-parser');
import { MembersDb, Member } from '../members-db';

interface Events {
  swipe(cardNumber: string): void;
}

interface AdminPanel {
  on<K extends keyof Events>(eventType: K, handler: Events[K]): void;
}

const stub = () => void 0;

function NewAdminPanel(membersDb: MembersDb): AdminPanel {
  const eventHandlers: Events = {
    swipe: stub,
  };

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

  app.get('/:cardId/swipe', async (req, res) => {
    const { cardId } = req.params;

    eventHandlers.swipe(cardId);

    return res.redirect('/');
  });

  app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
  });

  function on<K extends keyof Events>(eventType: K, handler: Events[K]) {
    eventHandlers[eventType] = handler;
  }

  return {
    on,
  };
}

export {
  AdminPanel,
  NewAdminPanel,
};
