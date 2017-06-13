import React = require('react');
import { Member } from '../../members-db';

interface Props {
  members: Member[];
}

class AdminIndex extends React.Component<Props, {}> {
  render() {
    return (
      <div>
        <h1>Security access panel</h1>

        <h2>Member list</h2>

        <ul>
          {
            this.props.members.map((member) => {
              return (
                <li key={member.cardId}>
                  <span>{`${member.firstName} ${member.lastName} ${member.cardId}`}</span>
                </li>
              );
            })
          }
        </ul>

        <h2>Add a new member</h2>

        <form method='post'>
          <div>
            <label htmlFor='firstName'>First Name:</label>
            <input type='text' name='firstName' />
          </div>
          <div>
            <label htmlFor='firstName'>Last Name:</label>
            <input type='text' name='lastName' />
          </div>
          <div>
            <label htmlFor='cardId'>Card ID:</label>
            <input type='text' name='cardId' />
          </div>
          <button type='submit'>Add</button>
        </form>
      </div>
    );
  }
}

export = AdminIndex;
