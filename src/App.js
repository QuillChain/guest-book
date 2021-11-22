import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import Form from './components/Form';
import SignIn from './components/SignIn';
import Messages from './components/Messages';
import { Navbar, Nav, NavDropdown, Container, Card, Button } from 'react-bootstrap';
{/* The following line can be included in your src/index.js or App.js file*/ }

import 'bootstrap/dist/css/bootstrap.min.css';

const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [messages, setMessages] = useState([]);

  const [isWriteMessage, setIsWriteMessage] = useState(false)
  useEffect(() => {
    // TODO: don't just fetch once; subscribe!
    contract.getMessages().then(setMessages);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const { fieldset, message, donation } = e.target.elements;

    fieldset.disabled = true;

    // TODO: optimistically update page with new message,
    // update blockchain data in background
    // add uuid to each message, so we know which one is already known
    contract.addMessage(
      {
        text: message.value,
        timestamp: new Date(),
      },
      BOATLOAD_OF_GAS,
      Big(donation.value || '0').times(10 ** 24).toFixed()
    ).then(() => {
      contract.getMessages().then(messages => {
        setMessages(messages);
        message.value = '';
        donation.value = SUGGESTED_DONATION;
        fieldset.disabled = false;
        message.focus();
      });
      setIsWriteMessage(true);
    });
  };

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'NEAR Guest Book'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    // <main>
    <Container>
      <Navbar collapseOnSelect expand="lg" bg="warning" variant="dark">
        <Container>
          <Navbar.Brand href="#home">GUEST BOOK</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              
            </Nav>
            <Nav>
              {currentUser
                ? <Button variant="danger"  onClick={signOut}>Log out</Button>
                : <Button variant="light" onClick={signIn}>Log in</Button>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>





      <header>
        <h1>Challenge Nearvember 04</h1>
        {currentUser
                ? <span></span>
                : <Button variant="primary" onClick={signIn}>Log in</Button>
              }
      </header>
      {currentUser
        ? <Form onSubmit={onSubmit} currentUser={currentUser} isWriteMessage={isWriteMessage} />
        : <SignIn />
      }
      {!!currentUser && !!messages.length && <Messages messages={messages} />}
      {/* </main> */}
    </Container>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    addMessage: PropTypes.func.isRequired,
    getMessages: PropTypes.func.isRequired
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;
