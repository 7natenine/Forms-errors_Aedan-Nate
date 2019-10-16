import React from 'react';
import './App.css';

import store from './Store';
import SideBar from './Components/SideBar';
import NoteContent from './Components/NoteContent';
import NoteSidebar from './Components/NoteSidebar';
import {Route, Switch, Link} from 'react-router-dom';
import NotefulContext from './Components/NotefulContext';
import NoteSection from './Components/NoteSection';

class App extends React.Component {

  state = {
    currentNote:{
      note: {},
      folder: ''
    },
    counter: {},
    folders: store.folders,
    notes: store.notes,
  };

  noteClicked = (id) => {
    let newNote = this.state.notes.find(note => note.id === id) 
    let currentFolder = this.state.folders.find(folder => folder.id === newNote.folderId);
    this.setState({
      currentNote: {
        note: newNote,
        folder: currentFolder.name,
      }
    })
  }

  folderCounter = () => {
    let newArray = this.state.folders.map(folder => {
      let counter = 0;
      this.state.notes.map(note => {
        if(note.folderId === folder.id) {
        counter++;
      } return null;
      })
      return {
        [folder.id]:counter
      };
    })

    let result = newArray.reduce((result, item) => {
      let key = Object.keys(item);
      result[key] = item[key];
      return result;
    }, {});

    this.setState({
      counter : result
    });
  }

  componentDidMount() {
    this.folderCounter();
  }

  render() {

    
    return(
      <div className='app-div'>
        <NotefulContext.Provider value = {{
          contextState: this.state,
          noteClicked:this.noteClicked,
          folderCounter:this.folderCounter,
        }}>
          <Switch>
            <Route 
              path='/note'
              component={NoteSidebar}
            />

            <Route 
              path='/'
              render={({match}) => (
                <SideBar 
                  match={match}
                />
              )} 
            />
          </Switch>
          
          <div className='app-second-div'>
            <header>
              <Link to="/">
                <h1>Noteful</h1>
              </Link>
            </header>

            <Route 
              exact 
              path='/' 
              component={NoteSection} 
            />

            <Route 
              path='/folder/:folderId' 
              render={({match}) => (
                <NoteSection 
                  match={match}
                />
              )} 
            />

            <Route 
              path='/note/:noteId' 
              render={({match}) => (
                <NoteContent match={match}
                />
              )} 
            />

          </div>
        </NotefulContext.Provider>
      </div>
    );
  }
}

export default App;
