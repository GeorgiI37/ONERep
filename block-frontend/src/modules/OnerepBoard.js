import React, { useState, useRef, useEffect } from "react";
import {connect} from "react-redux";
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import 'react-step-progress/dist/index.css';
import axios from 'axios';
const {SERVER_URL, LOCAL_URL} = require('../conf');

const OneRepBoardModule = (props) => {

    const [show, setShow] = useState(false);
    const [boardData, setBoardData] = useState([]);
    const handleShow = () => setShow(true);

    const getOneRepBoard = () => {
        axios.post(SERVER_URL + '/getOneRepBoard', {}).then(response => {
            setBoardData(response.data);
        });
    }

    useEffect(() => {
        if (localStorage.getItem('wallet') == '' || !localStorage.getItem('wallet'))
        {
            window.location.href = LOCAL_URL;
            return;
        }
        getOneRepBoard();
    })

    return (
        <section className="">
            <br/><br/>
            <div className="zl_all_page_heading_section">
                <div className="zl_all_page_heading">
                    <h2>ONERep Board</h2>
                    <p>Lorem Ipsum is simply dummy text of the printing & industry.</p>
                </div>
                <div className="zl_all_page_notify_logout_btn">

                </div>
            </div>
            <br/><br/>
            <Dropdown>
                <Dropdown.Toggle variant="dropdown" id="dropdown-basic">
                    Select DAO
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <br/>
            <div className="text-white text-sm lh-2">
                DAO Name : Russel <br/>
                Token Name : DAOCoin <br/>
                No of Tokens : 232
            </div>
            <br/><br/>
            <div>
                <Table striped className="zl_transaction_list_table table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Wallet Id</th>
                        <th>ONERep Tokens</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boardData.map((row, i) => {
                        return <tr key={i}>
                            <td>{row.username}</td>
                            <td>{row.wallet}</td>
                            <td className="zl_transaction_minas zl_transaction_list_value">{row.received}</td>
                        </tr>
                    })}
                    </tbody>
                </Table>
            </div>
        </section>
    );
}
const mapStoreToProps = ({ userAction }) => ({
});
export default connect(mapStoreToProps, null)(OneRepBoardModule);
