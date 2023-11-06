import logo from './logo.svg';
import './App.css';
import { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const addTodo = () => {
    if (input) {
      if ( editIndex !== null ) {
        const updatedTodos = [...todos];
        updatedTodos[editIndex] = {text: input, isEditing: false};
        setTodos(updatedTodos);
        setEditIndex(null);
      } else{
        setTodos([...todos, { text: input, isEditing: false, completed: false }]);
      };
      setInput('');
    }
  };

  const editTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].isEditing = true;
    setTodos(updatedTodos);
    setInput(updatedTodos[index].text);
    setEditIndex(index);
  };

  const cancelTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].isEditing = false;
    setTodos(updatedTodos);
    setInput('');
    setEditIndex(null);
  };

  const deleteTodo = (index) => {
    const updatedTodos = todos.filter((_,i) => i !== index )
    setTodos(updatedTodos);
    setEditIndex(null);
  };

  const clearAll = () => {
    setTodos([]);
    setEditIndex(null);
  }

  const toggleTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
    setEditIndex(null);
  }

  return (
    <div className="App">
      <h1>TODO List</h1>
      <div>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="add item..."/>
        <button onClick={addTodo}>{ editIndex !== null ? 'Save' : 'Add'}</button>
      </div>
      <br />
      <button onClick={clearAll}>Clear All</button>
      <br />
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo.isEditing ? (
              <div>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
                <button onClick={() => cancelTodo(index)}>Cancel</button>
              </div>
            ) : (
              <span
                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                onClick={() => toggleTodo(index)}
              >
                {todo.text}
              </span>
            )}
            <button onClick={() => editTodo(index)}>Edit</button>
            <button onClick={() => deleteTodo(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
