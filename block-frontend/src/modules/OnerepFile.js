import React, { useState, useRef, useEffect } from "react";
import {connect} from "react-redux";
import Table from 'react-bootstrap/Table';
import Modal from "react-bootstrap/Modal";
import StepProgressBar from 'react-step-progress';
import UploadService from "../service/upload-files.service";
// import { FileUploader } from "react-drag-drop-files";
import Papa from "papaparse"; 
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import axios from 'axios';
import $ from 'jquery';
import ReactDOMServer from 'react-dom/server';
import 'react-step-progress/dist/index.css';
const {SERVER_URL, LOCAL_URL} = require('../conf');

const OneRepFileModule = (props) => {

    // let ipfs = IPFSHTTPClient | undefined;
    // try {
    //     ipfs = create({
    //         url: "https://ipfs.infura.io:5001/api/v0",
    //     });
    // } catch (error) {
    //     console.error("IPFS error ", error);
    //     ipfs = undefined;
    // }
    
    const [show, setShow] = useState(false);
    const [showSucces, setshowSucces] = useState(false);
    const [repfiles, setRepFiles] = useState([]);

    const [progress, setProgress] = useState(0);
    const [ipfsPath, setipfsPath] = useState('');
    const [ipfsName, setipfsName] = useState('');
    const [reputation, setReputation] = useState(0);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        setFile(null);
        setTableRows([]);
        setValues([]);
        setStep(0);
        setProgress(0);
    };

    const handleCloseSuccess = () => setshowSucces(false);
    const handleShowSuccess = () => setshowSucces(true);

    const [images, setImages] = useState({ cid: CID, path: "" });
    
    const [totalMint, setTotalMint] = useState(0);

    const [file, setFile] = useState(null);
    
    const [parsedData, setParsedData] = useState([]);

    const [csvData, setCSVData] = useState([]);

    //State to store table Column name
    const [tableRows, setTableRows] = useState([]);

    //State to store the values
    const [values, setValues] = useState([]);

    const [step, setStep] = useState(0);
    
    useEffect(() => {
        if (localStorage.getItem('wallet') == '' || !localStorage.getItem('wallet'))
        {
            window.location.href = LOCAL_URL;
            return;
        }
        if (step == 1)
        {
            if ($('#step2')) {
                const str = ReactDOMServer.renderToString(step2Content);
                $('#step2').parent().html(str);
            }
        }
        else if (step == 2)
        {
            if ($('#step2')) {
                const str = ReactDOMServer.renderToString(step3Content);
                $('#step2').parent().html(str);
            }
        }
    }, [step]);

    const handleSubmit = () => {
        setShow(false);
        setTotalMint(totalMint + reputation);
        let wallet = localStorage.getItem('wallet'); 
        axios.post(SERVER_URL + '/files/add', {
            filename: ipfsName,
            ipfsuri: ipfsPath,
            status: true,
            reputation: reputation,
            data: values,
            wallet: wallet
        }).then(response => {
            getOneRepFile();
            handleShowSuccess();
        });
    };

    const getOneRepFile = () => {
        axios.get(SERVER_URL + '/files').then(response => {
            setRepFiles(response.data);
        });
    }
    getOneRepFile();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const files = e.target[0].files;
        if (!files || files.length === 0) {
            return alert("No files selected");
        }
        setFile(files[0]);

        //frontend upload
		// const result = ipfs.add(files[0]);
        // setipfsPath(result);
        // console.log("ipfs: " + result.path);

        //backend upload
        // const path = (window.URL || window.webkitURL).createObjectURL(files[0]);
        // axios.post(SERVER_URL + '/files/upload', {
        //     filepath: path
        // }).then(response => {
        // });
        let prefix = "data__"+Date.now()+"__";
        setipfsName(files[0].name);
        setipfsPath(prefix + files[0].name);
        UploadService.upload(files[0], prefix, (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        })
        .then((response) => {
            Papa.parse(files[0], {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const rowsArray = [];
                    const valuesArray = [];
            
                    setCSVData(results.data);

                    // Iterating data to get column name and their values
                    let rep = 0;
                    results.data.map((d) => {
                        rowsArray.push(Object.keys(d));
                        valuesArray.push(Object.values(d));
                        rep += parseInt(d.received);
                    });
                    setReputation(rep);
                    // Parsed Data Response in array format
                    setParsedData(results.data);
            
                    // Filtered Column Names
                    setTableRows(rowsArray[0]);
            
                    // Filtered Values
                    setValues([...values, ...valuesArray]);
                },
            });

            // this.setState({
            // message: response.data.message,
            // });
            // return UploadService.getFiles("data");
        })
        .then((files) => {
            // this.setState({
            // fileInfos: files.data,
            // });
        })
        .catch(() => {
            // this.setState({
            // progress: 0,
            // message: "Could not upload the file!",
            // currentFile: undefined,
            // });
        });
    }

    const step1Content = <div>
            <br/>
            <h5 className="text-center text-white">Upload Cordinape File</h5>
            <br/>
            {/* <FileUploader handleChange={handleChange} name="file" types={fileTypes} /> */}
            {(
            <>
                <p>Upload File using IPFS</p>
                <form onSubmit={onSubmitHandler}>
                    {/* <div className="progress">
                        <div
                            className="progress-bar progress-bar-info progress-bar-striped"
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: progress + "%" }}
                        >
                            {progress}%
                        </div>
                    </div> */}
                    <label className="btn btn-default text-white">
                        <input name="file" type="file" accept=".csv"/>
                    </label>
                    <button className="btn btn-success" type="submit">Upload File</button>
                </form>
            </>
            )}
        </div>;
    const step2Content = <div id="step2">
        <br/>
        <h5 className="text-center text-white">Verify the records</h5>
        <br/>
        <Table style={{"overflowWrap": "anywhere"}} responsive striped className="zl_transaction_list_table table">
            <thead>
                <tr>
                {tableRows.map((rows, index) => {
                return <th key={index}>{rows}</th>;
                })}
            </tr>
            </thead>
            <tbody>
            {values.map((value, index) => {
                return (
                <tr key={index}>
                    {value.map((val, i) => {
                    return <td key={i}>{val}</td>;
                    })}
                </tr>
                );
            })}
            </tbody>
        </Table>
        <br/>
        <div className="text-right text-white">
            <h6>Total Mint: {totalMint}</h6>
        </div>
    </div>;

    const step3Content = <div>
        <br/>
        <h5 className="text-center text-white">Mint and Allocate Tokens</h5>
        <br/>
        <div className="text-center text-white">
            <h6>Total Mint: {totalMint + reputation}</h6>
        </div>
        <br/>
    </div>;

    const step1Validator = () => {
        setTimeout(()=> {
            setStep(1);
        }, 100);
        return true;
    }

    const step2Validator = () => {
        setTimeout(()=> {
            setStep(2);
        }, 100);
        return true;
    }
  
    return (
        <section className="">
            <br/><br/>
            <div className="zl_all_page_heading_section">
                <div className="zl_all_page_heading">
                    <h2>ONERep Files (Cordianpe)</h2>
                    <p>Lorem Ipsum is simply dummy text of the printing & industry.</p>
                </div>
                <div className="zl_all_page_notify_logout_btn">
                    <ul className="v-link">
                        <li><button onClick={handleShow} className="btn-connect">Add ONERep File</button></li>
                    </ul>
                </div>
            </div>
            <br/><br/>
            <br/><br/>
            <div>
                <Table striped className="zl_transaction_list_table table">
                    <thead>
                    <tr>
                        <th>File Name</th>
                        <th>IPFS URI</th>
                        <th>Reputation Value</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {repfiles.map((row, i)=> (
                        <tr key={i}>
                            <td>{row.filename}</td>
                            <td>{row.ipfsuri}</td>
                            <td>{row.reputation}</td>
                            <td>{row.status ? 'Completed' : 'Failed'}</td>
                            <td>{row.created_at}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>

            <Modal centered show={show} size="lg" onHide={handleClose}>
                <Modal.Body>
                    <div className="p-4">
                        <StepProgressBar
                            onSubmit={handleSubmit}
                            startingStep={0}
                            submitBtnName="Mint"
                            nextBtnName="Next"
                            steps={[
                                {
                                    label: 'Step 1',
                                    content: step1Content,
                                    validator: step1Validator
                                },
                                {
                                    label: 'Step 2',
                                    content: step2Content,
                                    validator: step2Validator
                                },
                                {
                                    label: 'Step 3',
                                    content: step3Content,
                                }
                            ]}
                        />
                    </div>
                </Modal.Body>
            </Modal>
            <Modal centered show={showSucces} onHide={handleCloseSuccess}>
                <Modal.Body>
                    <div className="p-4">
                        <br/>
                        <h4 className="text-center text-white">Successfully <br/> Minted</h4>
                        <br/><br/>
                        <div className="text-center">
                            <button type="button" className="btn-connect" onClick={handleCloseSuccess}>
                            Okay Got it
                        </button></div>
                    </div>
                </Modal.Body>
            </Modal>
        </section>
    );
}
const mapStoreToProps = ({ userAction }) => ({
});
export default connect(mapStoreToProps, null)(OneRepFileModule);
