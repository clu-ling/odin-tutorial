import React from 'react';
import ReactDOM from 'react-dom';
import {Treebeard} from 'react-treebeard';

const data = {
    name: '...',
    toggled: false,
    children: [
        {
            name: 'Examples',
            children: [
                { name: 'example 1' },
                { name: 'example 2' }
            ]
        },
        {
            name: 'Challenges',
            children: [
                { name: 'challenge 1' },
                { name: 'challenge 2' }
            ]
        }
    ]
};

export default class TreeNav extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
    }
    onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(node.children){ node.toggled = toggled; }
        this.setState({ cursor: node });
    }
    render(){
        return (
            <Treebeard
                data={data}
                onToggle={this.onToggle}
            />
        );
    }
}
