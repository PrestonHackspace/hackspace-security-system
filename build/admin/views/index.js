"use strict";
const React = require("react");
class AdminIndex extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("h1", null, "Security access panel"),
            React.createElement("h2", null, "Member list"),
            React.createElement("ul", null, this.props.members.map((member) => {
                return (React.createElement("li", null,
                    React.createElement("span", null, `${member.firstName} ${member.lastName} ${member.cardId}`)));
            })),
            React.createElement("h2", null, "Add a new member"),
            React.createElement("form", { method: 'post' },
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: 'firstName' }, "First Name:"),
                    React.createElement("input", { type: 'text', name: 'firstName' })),
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: 'firstName' }, "Last Name:"),
                    React.createElement("input", { type: 'text', name: 'lastName' })),
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: 'cardId' }, "Card ID:"),
                    React.createElement("input", { type: 'text', name: 'cardId' })),
                React.createElement("button", { type: 'submit' }, "Add"))));
    }
}
module.exports = AdminIndex;
