interface Member {
  firstName: string;
  lastName: string;
  cardId: string;
}

function NewMembersDb() {
  function getByCardId(cardId: string): Member | null {
    return {
      firstName: cardId,
      lastName: cardId,
      cardId,
    };
  }

  return {
    getByCardId,
  };
}

export {
  NewMembersDb,
};
