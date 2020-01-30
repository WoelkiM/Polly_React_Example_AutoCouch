import React, { Component } from 'react';

type PollNameProps = {
    name: string
}

export class PollName extends Component<PollNameProps> {
    render () {
        return (
            <div>
                <h2>{this.props.name}</h2>
            </div>
        )
    }
}

export default PollName;