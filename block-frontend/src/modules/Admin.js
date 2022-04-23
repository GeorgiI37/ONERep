import React, { useState, useRef, useEffect } from "react";
import {connect} from "react-redux";
import Table from 'react-bootstrap/Table';
import { FaPencilAlt, FaUserAlt, FaTrashAlt, FaRegSave } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ToggleButton from 'react-toggle-button';
import axios from 'axios';
import { SERVER_URL, LOCAL_URL } from '../conf';

const AdminModule = (props) => {

    const defaultUser = {
        _id: '',
        username: '',
        wallet: '',
        badge: '',
        dao: '',
        isAdmin: false,
        status: false
    }
    const [show, setShow] = useState(false);
    const [admin, setSAdmin] = useState(false);
    const [enable, setEnable] = useState(false);
    const [users, setUsers] = useState([]);
    const [curUser, setCurUser] = useState(defaultUser);
    const handleClose = () => setShow(false);
    
    const handleShow = (user) => {
        setCurUser(user);
        setShow(true);
    }

    const handleDelete = (user) => {
        axios.post(SERVER_URL + '/users/delete', user).then(response => {
            setUsers(response.data);
        });
    }

    const handleSave = () => {
        curUser.isAdmin = admin;
        curUser.status = enable;
        axios.post(SERVER_URL + '/users/update', curUser).then(response => {
            if (response.data.success == true)
                setUsers(response.data.users);
            else
                alert(response.data.error);
        });
    }

    const borderRadiusStyle = { borderRadius: 2, height: 40,}
   
    const getContributors = () => {
        axios.get(SERVER_URL + '/users').then(response => {
            setUsers(response.data);
        });
    }

    useEffect(() => {
        if (localStorage.getItem('wallet') == '' || !localStorage.getItem('wallet'))
        {
            window.location.href = LOCAL_URL;
            return;
        }
        getContributors();
    })

    return (
        <section className="">
            <br/><br/>
            <div className="zl_all_page_heading_section">
                <div className="zl_all_page_heading"><h2>My ONERep Account</h2></div>
                <div className="zl_all_page_notify_logout_btn">
                    <ul className="v-link">
                        <li><button className="btn-connect"><FaPencilAlt /> Settings</button></li>
                        <li><button className="btn-connect" onClick={()=>{
                            setSAdmin(false)
                            setEnable(false)
                            handleShow(defaultUser)
                        }}>Add Contributor</button></li>
                    </ul>
                </div>
            </div>
            <br/><br/>
            <br/><br/>
            <div>
                <Table striped className="zl_transaction_list_table table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>ETH Wallet</th>
                        <th>Are you admin?</th>
                        <th>Reputation Awarded</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((item, i) => (
                        <tr key={i}>
                            <td><FaUserAlt/><span className="pl-2">{item.username}</span></td>
                            <td>{item.wallet}</td>
                            <td>{item.isAdmin ? 'Admin' : '-'}</td>
                            <td>{item.received}</td>
                            <td><FaPencilAlt onClick={()=>{
                                setSAdmin(item.isAdmin);
                                setEnable(item.status);
                                handleShow(item)}
                            } /> <span className="ml-2"><FaTrashAlt onClick={()=>{handleDelete(item)}} className="text-danger"/></span></td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>

            <Modal centered show={show} onHide={handleClose}>
                <Modal.Body>
                    <div className="p-4">
                        <h5 className="text-center text-white">Add contributor</h5>
                        <br/><br/>
                        <Form className="row">
                            <div className="col-md-12">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <div className="text-center"><Form.Label className="text-muted-dark">Contributor Name</Form.Label></div>
                                    <Form.Control type="text" name="username" value={curUser.username} placeholder="" onChange={(e)=>{curUser.username = e.target.value}} required/>
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <div className="text-center"><Form.Label className="text-muted-dark">Contributor ETH address</Form.Label></div>
                                    <Form.Control type="text" name="wallet" onChange={(e)=>{curUser.wallet = e.target.value}} value={curUser.wallet} placeholder="" />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Label className="text-muted-dark">Are They Admin?</Form.Label>
                                <ToggleButton
                                    name="isAdmin"
                                    value={ false|| admin }
                                    inactiveLabel="No"
                                    activeLabel="Yes"
                                    thumbStyle={borderRadiusStyle}
                                    trackStyle={borderRadiusStyle}
                                    onToggle={(value) => {
                                        setSAdmin(!value);
                                    }} />
                            </div>
                            <div className="col-md-6">
                                <Form.Label className="text-muted-dark">Enable</Form.Label>
                                <ToggleButton
                                    name="status"
                                    value={ enable|| false }
                                    inactiveLabel="No"
                                    activeLabel="Yes"
                                    thumbStyle={borderRadiusStyle}
                                    trackStyle={borderRadiusStyle}
                                    onToggle={(value) => {
                                        setEnable(!value);
                                    }} />
                            </div>
                            <div className="col-12 text-center">
                                <div className="zl_securebackup_btn"><button onClick={()=>{handleSave();}} className="mx-auto"><FaRegSave/><span className="ml-2">Save</span></button></div>
                            </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </section>
    );
}
const mapStoreToProps = ({ userAction }) => ({

});
export default connect(mapStoreToProps, null)(AdminModule);
