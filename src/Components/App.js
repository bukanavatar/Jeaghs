import React, {Component} from 'react';
import logo from '../logo2.png';
import {Button, FormControl, FormGroup, Grid, Modal, Row} from 'react-bootstrap';
import './App.css';
import ListAlarm from './ListAlarm';
import socketIOClient from 'socket.io-client';

class App extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChangeClock = this.handleChangeClock.bind(this);
        this.handleText = this.handleText.bind(this);
        this.state = {
            show: false,
            text: '',
            accessToken: '',
            alarmList: [],
            response: '',
            endpoint: 'http://127.0.0.1:4001'
        };
    }

    componentDidMount() {
        //Socket IO
        const {endpoint} = this.state;
        const socket = socketIOClient(endpoint);
        socket.on("FromAPI", data => this.setState({response: JSON.parse(JSON.stringify(data))}));
        //Get Token
        let bodyText = "grant_type=password&username=ikhsan&password=ikhsan95";
        fetch('https://api.thinger.io/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: bodyText
        })
            .then(res => res.json())
            .then(data => this.setState({
                accessToken: data.access_token
            }));
    }

    handleText(e) {
        e.preventDefault();
        this.setState({
            text: e.target.value
        })
    }

    handleChangeClock(e) {
        e.preventDefault();
        console.log(this.state.text);
        let bodyText = '{"in":"' + this.state.text + '"}';
        let token = 'Bearer ' + this.state.accessToken + '';
        fetch('https://api.thinger.io/v2/users/ikhsan/devices/esp32/command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: bodyText
        })
            .then(res => console.log(res))
            .then(data => {
                console.log(data);
            })
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
        const {response} = this.state;
        console.log(response);
        return (
            <div className="Main">
                <header className="header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    {/* <h1 className="App-title h1">Welcome </h1> */}
                </header>
                <div className="container containerMain">
                    <h4>Status</h4>
                    {response ? <p>{response.out}</p> : <p>Loading...</p>}
                    <h3>Alarm List</h3>
                    <Grid>
                        <Row>
                            {this.state.alarmList.map(a =>
                                <ListAlarm/>
                            )}
                        </Row>
                    </Grid>
                    {/*Modal*/}
                    <p onClick={this.handleShow} style={{cursor: 'pointer'}}>Add Alarm</p>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Body>
                            <form onSubmit={this.handleChangeClock}>
                                <FormGroup>
                                    <FormControl
                                        value={this.state.text}
                                        onChange={this.handleText}
                                    />
                                    <Button bsStyle="primary" type="submit">Submit</Button>
                                </FormGroup>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleClose}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                    {/*End of Modal*/}
                </div>
            </div>
        );
    }
}

export default App;
