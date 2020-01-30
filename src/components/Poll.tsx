import React, { Component } from 'react';
import Opt from './Opt';
import {ListCRDT} from './crdts/ListCRDT';
import {OptCRDT} from './crdts/OptCRDT';

type PollProps = {
    opts: ListCRDT<OptCRDT>,/*{id: any, title: string, chosen: boolean, votes: number}[],*/
    markCheck(id: any) : void,
    delOpt(opt: OptCRDT) : void
}

type PollState = {
    opts: OptCRDT[]
}

class Poll extends Component<PollProps, PollState> {

    constructor(props: PollProps) {
        super(props);
        this.state = {
           opts: []
        };
        this.componentDidUpdate();
      }

    componentDidUpdate() {
        this.props.opts.getPureList().then((optList: OptCRDT[]) => {
            if(optList.length === this.state.opts.length && optList.every((opt, index, _arr) => {
                return opt.getId() === this.state.opts[index].getId();
            })) {
                return;
            }
            this.setState({opts: optList});
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        if(!this.state.opts) return null;
        return this.state.opts.map((opt) => (
            <Opt key={opt.getId()} opt={opt} markCheck={this.props.markCheck} delOpt={this.props.delOpt}/>
        ));
    }
}

export default Poll;
