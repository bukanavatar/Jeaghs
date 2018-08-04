import React, { Component } from 'react';
import logo from './logo2.png';
import React, {Component} from 'react';
import logo from './logo.svg';
import {Button, Modal} from 'react-bootstrap';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            show: false
        };
    }

    handleShow() {
        this.setState({
            show: true
        });
    }

    handleClose() {
        this.setState({
            show: false
        });
    }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* <h1 className="App-title h1">Welcome </h1> */}
        </header>
          <div className="container">
              {}
              <p onClick={this.handleShow} style={{cursor: 'pointer'}}>Add Alarm</p>
              <Modal show={this.state.show} onHide={this.handleClose}>
                  <Modal.Body>

                  </Modal.Body>
                  <Modal.Footer>
                      <Button onClick={this.handleClose}>Cancel</Button>
                      <Button bsStyle="primary" onClick={this.handleClose}>Save</Button>
                  </Modal.Footer>
              </Modal>
          </div>
      </div>
    );
  }
}

export default App;
