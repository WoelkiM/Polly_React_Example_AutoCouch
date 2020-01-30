import React, { Component } from 'react';
import CSS from 'csstype';
import {OptCRDT} from './crdts/OptCRDT'

type OptProps = {
    opt: OptCRDT,
    markCheck(id: any): void,
    delOpt(opt: OptCRDT): void
}


export class Opt extends Component<OptProps> {

    getStyle = () => {
        return {
            background: '#f4f4f4',
            padding: '10px',
            borderBottom: '1px #ccc dotted',
        }
    }

    render() {
        const optCrdt = this.props.opt;
        const id =  optCrdt.getId();
        const title = optCrdt.getTitle();
        const votes = optCrdt.getVotes();
        return (
            <div style={this.getStyle()}>
                <p>
                    <input type="radio" name="myPoll" onChange={this.props.markCheck.bind(this, id)}/> {' '}
                    {title} [Votes = {votes}]
                    <button onClick={this.props.delOpt.bind(this, optCrdt)} style={btnStyle}>x</button>
                </p>
            </div>
        )
    }
}


const btnStyle : CSS.Properties = {
    background: '#ff0000',
    color: '#fff',
    border: 'none',
    padding: '5px 5px',
    borderRadius: '50%',
    cursor: 'pointer',
    float: 'right'
}

export default Opt;
