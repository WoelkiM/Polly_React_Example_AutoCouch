import React, { Component } from 'react';

type AddOptState = {
    title: string
}

type AddOptProps = {
    addOpt(title: string) : void;
}

export class AddOpt extends Component<AddOptProps, AddOptState> {
    state = {
        title: ''
    }

    onChange = (e : React.ChangeEvent<HTMLInputElement>) => this.setState({
        [e.target.name]: e.target.value
    } as any);

    onSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.props.addOpt(this.state.title);
        this.setState({ title: '' });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit} style={{display: 'flex'}}>
                <input
                    type="text"
                    name="title"
                    style={{flex: '10', padding: '5px'}}
                    placeholder="Add Option..."
                    value={this.state.title}
                    onChange={this.onChange}
                />
                <input
                    type="submit"
                    value="Add Option"
                    className="btn"
                    style={{flex: '1'}}
                />
            </form>
        )
    }
}

export default AddOpt

