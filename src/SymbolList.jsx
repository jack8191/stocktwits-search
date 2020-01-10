/* eslint-disable consistent-return */
/* eslint-disable no-debugger */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/state-in-constructor */
/* eslint-disable react/prop-types */
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardColumn from 'react-bootstrap/CardColumns';
import CashtagLink from 'stocktwits-react-text-js';

export default class SymbolList extends React.Component {
  handleClick = (data) => {
    this.props.remove(data);
  };

  generateLists = (data) => {
    const listToRender = data.map((item) => {
      // const imageUrl = message.user.avatar_url + '/100px100';
      const messagesToRender = item.messages.map((message) => (
        <Card key={message.id} style={{ width: '18rem' }}>
          <Card.Img style={{ width: '50px', height: '50px' }} variant="top" src={message.user.avatar_url} />
          <Card.Title>{message.user.username}</Card.Title>
          <Card.Text>{message.body}</Card.Text>
          <Card.Footer>{message.created_at}</Card.Footer>
        </Card>
      ));
      return (
        <CardColumn key={item.symbol.symbol}>
          <h2><CashtagLink text={item.symbol.symbol}/></h2>
          <p>
            Number of messages:
            {item.messages.length}
          </p>
          <Button onClick={() => this.handleClick(item.symbol.symbol)}>
            Click to Close
          </Button>
          {messagesToRender}
        </CardColumn>
      );
    });
    return listToRender;
  };

  render() {
    const data = this.props.twitList;
    const listToRender = this.generateLists(data);
    return (
      <div>
        {listToRender}
      </div>
    );
  }
}
