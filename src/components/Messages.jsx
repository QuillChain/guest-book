import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import {Card, Button} from 'react-bootstrap'

export default function Messages({ messages }) {
  return (
    <>
      <h2>Messages</h2>
      {messages.map((message, i) =>
        <div key={i} className={message.premium ? 'Card is-premium' : 'Card'}>
          <p style={{ marginLeft: '10px' }}>
            {message.premium ? <span> Premium </span> : <span></span> } 
            <span> Message: </span>
            <strong>"{message.text}"</strong><br/>
            <small><i>By <span className="sender">{message.sender}</span>  ( <span className="date"><Moment format='MMMM Do YYYY, h:mm:ss a'>{message.timestamp}</Moment></span> )</i></small>
          </p>
        </div>
      )}
    </>
  );
}

Messages.propTypes = {
  messages: PropTypes.array
};
