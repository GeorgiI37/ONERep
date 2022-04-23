import React, { useState, useRef, useEffect } from "react";
import {connect} from "react-redux";
import Form from 'react-bootstrap/Form';
import { SERVER_URL } from "../conf";

const WalletConnectModule = (props) => {

    const[wallet, setWallet] = useState('');

    useEffect(() => {
        setWallet(localStorage.getItem('wallet'));
    })

    return (
        <section className="">
            <br/><br/>
            <br/><br/>
            <h2 className="header-1 text-center">Create a ONERep Account</h2>
            <br/><br/>
            <br/><br/>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <Form className="row" action={SERVER_URL + "/users/register"} method="post">
                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <div className="text-center"><Form.Label className="text-muted-dark">User Name</Form.Label></div>
                                <Form.Control type="text" name="username" placeholder="" required/>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="formBasicText">
                                <div className="text-center"><Form.Label className="text-muted-dark">Address</Form.Label></div>
                                <Form.Control type="text" value={wallet} name="wallet" placeholder="" required readonly/>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="formBasicText">
                                <div className="text-center"><Form.Label className="text-muted-dark">Badge Name</Form.Label></div>
                                <Form.Control type="text" name="badge" placeholder="" required/>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3" controlId="formBasicText">
                                <div className="text-center"><Form.Label className="text-muted-dark">DAO Name</Form.Label></div>
                                <Form.Control type="text" name="dao" placeholder="" required/>
                            </Form.Group>
                        </div>
                        <div className="col-12 text-center">
                            <div className="zl_securebackup_btn"><button type="submit" className="mx-auto">Launch this ONERep</button></div>
                        </div>
                    </Form>
                </div>
            </div>

        </section>
    );
}
const mapStoreToProps = ({ userAction }) => ({
});
export default connect(mapStoreToProps, null)(WalletConnectModule);
