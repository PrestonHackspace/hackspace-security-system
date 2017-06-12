"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra-promise");
const path = require("path");
const membersFile = path.join(__dirname, '..', 'db', 'members.json');
function NewMembersDb() {
    async function loadData() {
        try {
            const json = await fs.readFileAsync(membersFile, 'utf8');
            return JSON.parse(json);
        }
        catch (err) {
            return [];
        }
    }
    async function saveData(members) {
        const json = JSON.stringify(members);
        return fs.writeFileAsync(membersFile, json, 'utf8');
    }
    async function getByCardId(cardId) {
        const members = await loadData();
        return members.find((m) => m.cardId === cardId);
    }
    async function addMember(member) {
        const members = await loadData();
        members.push(member);
        return saveData(members);
    }
    async function getAllMembers() {
        return loadData();
    }
    return {
        getByCardId,
        getAllMembers,
        addMember,
    };
}
exports.NewMembersDb = NewMembersDb;
