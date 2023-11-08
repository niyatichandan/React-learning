import logo from './logo.svg';
import './App.css';
import { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editInput, setEditInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const addTodo = (e) => {
    e.preventDefault();
   // if (input) {
      if ( editIndex !== null ) {
        const updatedTodos = [...todos];
        updatedTodos[editIndex] = {text: editInput, isEditing: false};
        setTodos(updatedTodos);
        setEditInput('');
        setEditIndex(null);
      } else{
        setTodos([...todos, { text: input, isEditing: false, completed: false }]);
        setInput('');
      };
   // }
  };

  const editTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].isEditing = true;
    setTodos(updatedTodos);
    setEditInput(updatedTodos[index].text);
    setEditIndex(index);
  };

  const cancelTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].isEditing = false;
    setTodos(updatedTodos);
    setEditInput('');
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
    <div>
      <h1>TODO List</h1>
      <div>
        <form onSubmit={addTodo}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="add item..."/>
          <button type="submit" disabled={input ? false : true}>Add</button>
        </form>
      </div>
      <br />
      <button onClick={clearAll} disabled={todos.length == 0 ? true : false}>Clear All</button>
      <br />
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo.isEditing ? (
              <div>
                <input type="text" value={editInput} onChange={(e) => setEditInput(e.target.value)}/>
                <button onClick={addTodo}>Save</button>
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
}

export default App;
