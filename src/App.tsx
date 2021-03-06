import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Poll from './components/Poll';
import Header from './components/layout/Header';
import PollName from './components/layout/PollName';
import AddOpt from './components/AddOpt';
import About from './components/pages/About';
import uuid from 'uuid';
import './App.css';
import { ROOT_ID } from './constants'

import { ListCRDT } from './components/crdts/ListCRDT';
import { OptCRDT } from './components/crdts/OptCRDT';
import { db, factory, standardCatch } from 'autocouch';
import AutoCouchList from './components/crdts/AutoCouchList';
import { AutoCouchOpt, OptType } from './components/crdts/AutoCouchOpt';
import AutoCouchWrapper from './components/crdts/AutoCouchWrapper'


type AppState = {
    name: string,
    opts?: ListCRDT<OptCRDT>,
    username: string
}

class App extends Component<{}, AppState> {

    constructor(props: {}) {
        super(props);
        //db.clean();
        //return;
        registerTypes();
        this.state = {
            name: 'Best lecture of the course',
            opts: undefined,
            username: 'Pascal'
        };
        loadRootList().then(list => {
            if(list) {
                list.on(() => {
                    this.setState(this.state);
                    //this.render();
                });
                //TODO: Check why list is not okay here.
                list.getPureList().then((optList: OptCRDT[]) => {
                    console.log(optList);
                    optList.forEach((opt)=>{
                        opt.on(() => {
                            this.setState(this.state);
                            //this.render();
                        });
                    })
                }).catch(doc =>{
                    console.log("error")
                });
            }
            this.setState({ opts: list});
        }).catch(err => {
            console.log(err);
            createRoot().then(list => {
                if(list) list.on(() => this.setState(this.state));
                this.setState({ opts: list});
            })
            console.log("error path");
            throw new Error('You need to connect to the server once to initialize the app.');
        })
    }
    markCheck = (id: any) => {
        if(this.state.opts) {
            this.state.opts.getPureList().then((optList: OptCRDT[]) => {
                Promise.all(optList.map(async (opt : OptCRDT) => {
                    if (opt.getChosen(this.state.username)) {
                        await opt.unmark(this.state.username);
                    }
                    if (opt.getId() === id) {
                        await opt.mark(this.state.username);
                    }
                    return opt;
                })).then(_ => {
                    this.setState({opts: this.state.opts});
                });
            });
        } else {

        }
    };

    delOpt = (opt: OptCRDT) => {
        if(this.state.opts) {
            this.state.opts.remove(opt).then(list => {
                this.setState({ opts: list});
            })
        }
    };

    addOpt = (title: string) => {
        const newOption = factory.createObject<OptType, AutoCouchOpt>(
            AutoCouchOpt.OBJECT_TYPE,
            uuid.v4(),
            title,
            false,
            0
        );
        newOption.on(() => {
            this.setState(this.state);
        });
        if(this.state.opts) {
            this.state.opts.add(newOption).then(list => {
                this.setState({ opts: list});
            })
        } else {

        }
    };

    render() {
        if(this.state.opts) {
            let opts = this.state.opts;
            return (
                <Router>
                    <div className="App">
                        <div className="container">
                            <Header />
                            <Route exact path="/" render={props => (
                                <React.Fragment>
                                    <PollName name={this.state.name} />
                                    <AddOpt addOpt={this.addOpt}/>
                                    <Poll opts={opts} markCheck={this.markCheck} delOpt={this.delOpt}/>
                                </React.Fragment>
                            )} />
                            <Route path="/about" component={About} />
                        </div>
                    </div>
                </Router>
            );
        } else {
            //TODO implement loading screen?
            return (
                <Router>
                    <div className="App">
                        <div className="container">
                            <Header />
                            <Route path="/about" component={About} />
                        </div>
                    </div>
                </Router>
            );
        }
    }
}

function loadRootList(): Promise<ListCRDT<OptCRDT>> {
    return db.get(ROOT_ID).then((object: any) => {
        return factory.loadObject<String[], AutoCouchList<AutoCouchOpt>>(object.object);
    });
}

async function createRoot(): Promise<AutoCouchList<AutoCouchOpt>> {
    let list: AutoCouchList<AutoCouchOpt> = factory.createObject<String[], AutoCouchList<AutoCouchOpt>>(AutoCouchList.OBJECT_TYPE);
    let my_doc = {
        _id: ROOT_ID,
        object: list.getObjectId()
    }
    await db.put(my_doc).catch(standardCatch("createRoot"));
    console.log("Created root list");
    return list;
}

function registerTypes(): void {
    factory.registerType(
        AutoCouchOpt.OBJECT_TYPE,
        (id: any, title: string, chosen: boolean, votes: number) => {
            return new AutoCouchOpt(id, title, chosen, votes);
        },
        (doc) => {
            return new AutoCouchOpt('', '', true, 0, doc);
        }
    );
    factory.registerType(
        AutoCouchList.OBJECT_TYPE,
        function<T>(...elements: T[]) {
            return new AutoCouchList(undefined, ...elements);
        },
        (doc) => {
            return new AutoCouchList(doc);
        }
    );
    factory.registerType(
        AutoCouchWrapper.OBJECT_TYPE,
        (object: any) => {
            return new AutoCouchWrapper(object);
        },
        (doc) => {
            return new AutoCouchWrapper({}, doc);
        }
    );
}

export default App;
