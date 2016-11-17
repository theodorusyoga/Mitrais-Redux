import React from 'react';
import * as panel from './panel';
import { test } from './panel';

const expressionBodies = () => {
    let str = 'Pineapple'
    let arr = ['Apple', 'Banana', 'Chicken', 'Duck'];
    var i = 2;
    let combine = [...arr.slice(0, i), str, ...arr.slice(i+1)]
    return combine.map((item, i, list) => 
      
     <p key={i}>Item at index <b>{i}</b> is <b>{item}</b> in the list: <b>{list.join(', ')}</b></p>
    
        
    )
}


class ES6 extends React.Component {

    constructor() {
        super();
        this.state = {
            promise1: '',
            promise2: ''
        }
    }



    //ES6
    blockScopedVariables() {
        let callbacks = [];
        for (let i = 0; i <= 3; i++) {
            callbacks[i] = () => {
                return i * 2;
            }
        }

        var a = 4;
        {
            var a = 5;
        }

        //call methods
        return (
            <div>
                <h2>Block-scoped variables</h2>
                <small>Variables as parameters used in function</small><br />
                Callback 0 : {callbacks[0]()} <br />
                Callback 1 : {callbacks[1]()} <br />
                Callback 2 : {callbacks[2]()} <br />
                Callback 3 : {callbacks[3]()} <br />
            </div>

        )
    }

    defaultParameters(r, g, b, a) {
        r = r || 255;
        g = g || 255;
        b = b || 255;
        a = a || 255;
        return (
            <div>
                <h2>Default parameters</h2>
                <small>Parameters below have default parameters = 255 if variables are undefined</small><br />
                R: {r} <br />
                G: {g} <br />
                B: {b} <br />
                A: {a} <br />
            </div>
        )
    }

    templateLiterals() {
        let first = 'Theo'
        let last = 'Yoga'
        var test = `Your name is ${first} ${last}`;
        var join = `Your name is ${first} ${last}`
        return (
            <div>
                <h2>Template literals</h2>
                <p>{test}</p>
            </div>
        )
    }

    destructuringAssignment(data) {

        let { house, car, mouse, print } = data;
        
        return (
            <div>
                <h2>Destructuring assignment</h2>
                <p>House: {house}</p>
                <p>Car: {car}</p>
                <p>Mouse: {mouse}</p>
                <p>{print()}</p>
            </div>
        )
    }

    enhancedObjectLiterals() {
        var obj = {
            house: "Brown",
            car: "Audi",
            mouse: "Logitech",
            combine: () => {
                return `House ${house}, Car ${car}, Mouse ${mouse}`
            }
        };
        var newobj = Object.create(obj);
        var newobj = {
            __proto__: obj,
            newfun() {
                return 'This is new function in the copied object: ' + super.house +
                    ', ' + super.car + ', ' + super.mouse;
            }
        }

        let { newfun } = newobj

        return (
            <div>
                <h2>Enhanced object literals</h2>
                <p>Generated new function: {newfun()}</p>
            </div>
        )
    }

    promises() {
        var wait = () => new Promise((resolve, reject) => {
            setTimeout(resolve, 1000)
        })
        wait().then(() => {
            this.state.promise1 = 'This paragraph appears after 1 second'
            this.forceUpdate();
            return wait();
        })
            .then(() => {
                this.state.promise2 = 'This paragraph appears after 2 seconds'
                this.forceUpdate();
            })
        return (
            <div>
                <h2>Promises</h2>
                <p>{this.state.promise1}</p>
                <p>{this.state.promise2}</p>
            </div>
        )
    }

    letAndConst() {
        //var
        var test = 0;
        {
            var test = 100;
        }
        {
            var test = 1000;
        }
        var test = 10;
        //let
        let test1 = 0;
        let test2;
        {
            let test1 = 100;
        }

        //const
        const test3 = 0;
        {
            const test3 = 100;
        }

        return (
            <div>
                <h2>Block-scoped constructs let and const</h2>
                <p>This is block-scoped var: {test}</p>
                <p>This is block-scoped assigned let: {test1}</p>
                <p>This is unassigned let: {test2}</p>
                <p>This is block-scoped const: {test3}</p>
            </div>
        )
    }

    exportImport(){
        return(
            <div>
                <h2>Export import class</h2>
                <p>{panel.test}</p>
                <p>{test}</p>
            </div>
        )
    }


    render() {
        return (
            <div className="x_panel">
                <div className="x_title">
                    <h2>EcmaScript 6</h2>
                    <ul className="nav navbar-right panel_toolbox">
                        <li><a className="collapse-link"><i className="fa fa-chevron-up"></i></a>
                        </li>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></a>
                            <ul className="dropdown-menu" role="menu">
                                <li><a href="#">Settings 1</a>
                                </li>
                                <li><a href="#">Settings 2</a>
                                </li>
                            </ul>
                        </li>
                        <li><a className="close-link"><i className="fa fa-close"></i></a>
                        </li>
                    </ul>
                    <div className="clearfix"></div>
                </div>
                <div className="x_content">
                    {this.blockScopedVariables()}
                    {this.defaultParameters(undefined, undefined, undefined, undefined)}
                    <h2>Arrow function</h2>
                    {expressionBodies()}
                    {this.templateLiterals()}
                    {this.destructuringAssignment({ house: 'Brown', car: 'Audi', mouse: 'Logitech', print: () => { return 'test'} })}
                    {this.enhancedObjectLiterals()}
                    {this.promises()}
                    {this.letAndConst()}
                    {this.exportImport()}
                </div>
            </div>
        )
    }
}

export default ES6