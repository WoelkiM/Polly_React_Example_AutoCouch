import React from 'react';
import { Link } from 'react-router-dom';
import CSS from 'csstype';

function Header() : JSX.Element {
    return (
        <header style={headerStyle}>
            <h1>Poll app demo</h1>
            <Link style={linkStyle} to="/">Home</Link> |
            <Link style={linkStyle} to="/about">About</Link>
        </header>
    )
}

const headerStyle: CSS.Properties = {
    background: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '10px'
}

const linkStyle: CSS.Properties = {
    color: '#fff',
    textDecoration: 'none'
}

export default Header;