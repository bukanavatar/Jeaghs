import React, {Component} from 'react';
import { TimePicker, Button } from 'antd';
// import { TimePicker } from 'antd';
import moment from 'moment';
import logo from '../logo2.png';
import {Button, FormControl, FormGroup, Grid, Modal, Row} from 'react-bootstrap';
import './App.css';
import ListAlarm from './ListAlarm';
import socketIOClient from 'socket.io-client';

const format = 'HH:mm';

function onChange(time, timeString) {
    console.log(time, timeString);
    // console.log(moment.i);
  }
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
            response: false,
            endpoint: 'http://127.0.0.1:4001',
            open: false,
            value: '',
            // message: '',
            isAlarmSet: false
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

    onChange = (moment) => {
        // console.log(moment.format("HH:mm"));
        this.setState({ text: moment.format("HH:mm") });
      }

    handleChangeClock(moment) {
        this.setState({
            text: moment.format("HH:mm"),
            // message: 'Your alarm has set!',
            isAlarmSet: true,
         });
        console.log(this.state.accessToken);
        // e.preventDefault();
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
        const {message} = this.state;
        console.log(response);
        return (
            <div className="Main">
                <header className="header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    {/* <h1 className="App-title h1">Welcome </h1> */}
                </header>
                <div className="container containerMain ">
                    <div style={{marginTop: '50px', paddingLeft: window.innerWidth < 768? '1em' : '0'}} >
                        <h3 >Status</h3>
                        {response ? <p>Halo: {response}</p> : <p>Loading...</p>}
                    </div>
                    <div style={{marginTop: '50px', paddingLeft: window.innerWidth < 768? '1em' : '0'}} >
                        <h3  style={{marginTop: '35px'}}>Add alarm</h3>
                        <Grid>
                            <Row>
                                {this.state.alarmList.map(a =>
                                    <ListAlarm/>
                                )}
                            </Row>
                        </Grid>
                        {/*Modal*/}
                        {/* <p onClick={this.handleShow} style={{cursor: 'pointer'}}>Add Alarm</p> */}
                        {/* <TimePicker onChange={onChange} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />, */}
                        <TimePicker  format={format} onChange={this.handleChangeClock} />

                        {/* <Modal show={this.state.show} onHide={this.handleClose}> */}
                            {/* <Modal.Body> */}
                                {/* <TimePicker defaultValue={moment('12:08', format)} format={format} onChange={this.handleChangeClock}/>, */}
                                {/* <form onSubmit={this.handleChangeClock}>
                                    <FormGroup>
                                        <FormControl
                                            value={this.state.text}
                                            onChange={this.handleText}
                                        />
                                        <Button bsStyle="primary" type="submit">Submit</Button>
                                    </FormGroup>
                                </form> */}
                                {/* <TimePicker
                                    disabledSeconds
                                    open={this.state.open}
                                    onOpenChange={this.handleOpenChange}
                                    addon={() => (
                                        <Button size="small" type="primary" onClick={this.handleClose}>
                                            Ok
                                        </Button>
                                        )}
                                /> */}
                                {/* <TimePicker defaultValue={moment('12:08', format)} format={format} onChange={this.handleChangeClock}/> */}
                            {/* </Modal.Body> */}
                            {/* <Modal.Footer>
                                <Button onClick={this.handleClose}>Close</Button>
                            </Modal.Footer>
                        </Modal> */}
                        {/*End of Modal*/}
                        <p className="text-success pt-5"  style={{marginTop: '10px'}}>{this.state.isAlarmSet? 'Your alarm is set! ' : ''}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
