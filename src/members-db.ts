import fs = require('fs-extra-promise');
import path = require('path');

const membersFile = path.join(__dirname, '..', 'db', 'members.json');

interface Member {
  firstName: string;
  lastName: string;
  cardId: string;
}

interface MembersDb {
  getByCardId(cardId: string): Promise<Member | undefined>;
  getAllMembers(): Promise<Member[]>;
  addMember(member: Member): Promise<void>;
  deleteByCardId(cardId: string): Promise<void>;
}

function NewMembersDb(): MembersDb {
  async function loadData() {
    try {
      const json = await fs.readFileAsync(membersFile, 'utf8');
      return JSON.parse(json) as Member[];
    } catch (err) {
      return [];
    }
  }

  async function saveData(members: Member[]) {
    const json = JSON.stringify(members);

    return fs.writeFileAsync(membersFile, json, 'utf8');
  }

  async function getByCardId(cardId: string): Promise<Member | undefined> {
    const members = await loadData();

    return members.find((m) => m.cardId === cardId);
  }

  async function addMember(member: Member) {
    const members = await loadData();

    members.push(member);

    return saveData(members);
  }

  async function getAllMembers() {
    return loadData();
  }

  async function deleteByCardId(cardId: string): Promise<void> {
    const members = await loadData();

    const member = await getByCardId(cardId);

    if (!member) return Promise.reject(new Error(`Member with card ID ${cardId} not found`));

    members.splice(members.indexOf(member), 1);

    return saveData(members);
  }

  return {
    getByCardId,
    getAllMembers,
    addMember,
    deleteByCardId,
  };
}

export {
  Member,
  MembersDb,
  NewMembersDb,
};
