import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.scss';
import App from './app/app';

const mountNode = document.getElementById('root');
ReactDOM.render(<App dataTestId="trading-app" />, mountNode);
