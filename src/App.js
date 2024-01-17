import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import ToDoComponent from './ToDoComponent.js';

function App() {

  return (
    <div>
      <h1>TODO List</h1>
      <ToDoComponent />
    </div>
  );
}

export default App;
