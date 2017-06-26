import React = require('react');
import { AdminIndexProps } from '../types';

class AdminIndex extends React.Component<AdminIndexProps, {}> {
  render() {
    return (
      <div>
        <h1>Security access panel</h1>

        <div>Mode of operation: {this.props.mode}</div>

        <h2>Member list</h2>

        <ul>
          {
            this.props.members.map((member) => {
              return (
                <li key={member.cardId}>
                  <a href={`/${member.cardId}/delete`}>Delete</a>
                  &nbsp;
                  <a href={`/${member.cardId}/swipe`}>Swipe</a>
                  &nbsp;
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
            <div>
              <input type='text' name='firstName' />
            </div>
          </div>
          <div>
            <label htmlFor='firstName'>Last Name:</label>
            <div>
              <input type='text' name='lastName' />
            </div>
          </div>
          <div>
            <label htmlFor='cardId'>Card ID:</label>
            <div>
              <input type='text' name='cardId' />
            </div>
          </div>
          <button type='submit'>Add</button>
        </form>
      </div>
    );
  }
}

export = AdminIndex;
