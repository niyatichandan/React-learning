import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import DeleteButton from './DeleteButton.js';
import ErrorComponent from './ErrorComponent.js';
import WarningComponent from './WarningComponent.js';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function App() {
  const [todos, setTodos] = useState([]);
  const [originalTodos, setOriginalTodos] = useState([...todos]);
  const [input, setInput] = useState('');
  const [editInput, setEditInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState();
  const [warning, setWarning] = useState();

  const addTodo = (e) => {
    e.preventDefault();
    setError();
    if ( editIndex !== null ) {
      const updatedTodos = [...todos];
      if ( updatedTodos[editIndex].isDuplicate ) {
        let indexes = updatedTodos.map( (element,index) => {if(element.text === updatedTodos[editIndex].text) return index});
        indexes.map(i => { updatedTodos[i] = {id: todos[editIndex].id, text: editInput, isEditing: false, completed: todos[editIndex].completed, completedCount: todos[editIndex].completedCount, isDuplicate: todos[editIndex].isDuplicate }});
        console.log(updatedTodos);
      }else{
        updatedTodos[editIndex] = {id: todos[editIndex].id, text: editInput, isEditing: false, completed: todos[editIndex].completed, completedCount: todos[editIndex].completedCount, isDuplicate: todos[editIndex].isDuplicate };
      }
      setTodos(updatedTodos);
      setOriginalTodos(updatedTodos);
      setEditInput('');
      setEditIndex(null);
      setWarning();
    } else{
      let index = todos.findLastIndex( element => {
        if (element.text === input) {
          return true
        }
      });

      if( index === -1 || todos[index].completed === true ){
        const todoId = todos.length === 0 ? 1 : Math.max(...todos.map((todo) => parseInt(todo.id, 10))) + 1;
        let duplicateValue = false, completedCount = 0;
        if( index !== -1 ) {
          duplicateValue = true;
          completedCount = todos[index].completedCount + 1;
          todos[index].isDuplicate = duplicateValue;
          todos[index].completedCount = completedCount;
        }
        const newTodo = { id: todoId.toString(), text: input, isEditing: false, completed: false, completedCount: completedCount, isDuplicate: duplicateValue };
        
        setTodos([...todos, newTodo]);
        setOriginalTodos([...todos, newTodo]);
        setInput('');
      }else{
        setError({message: 'There is already a pending item'});
      }
    };
  };

  const editTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].isEditing = true;
    setTodos(updatedTodos);
    setEditInput(updatedTodos[index].text);
    setEditIndex(index);
    updatedTodos[index].isDuplicate ? setWarning({message: 'All the duplicate Todo items will be impacted on editing'}) : setWarning();
  };

  const cancelTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].isEditing = false;
    setTodos(updatedTodos);
    setEditInput('');
    setEditIndex(null);
    setWarning();
  };

  const deleteTodo = (index) => {
    let updatedTodos = [];
    if ( todos[index].isDuplicate ) {
      setWarning()
      let indexes = todos.map( (element,i) => {if(element.text === todos[index].text) return i});
      updatedTodos = todos.filter(v => { return indexes.includes(v); }); 
    }else{
      updatedTodos = todos.filter((_,i) => i !== index )
    }
    setTodos(updatedTodos);
    setEditIndex(null);
    console.log("Item deleted");
  };

  const resetList = () => {
    setTodos([]);
    setEditIndex(null);
  }

  const pendingTodoList = () => {
    const updatedTodos = originalTodos.filter((todo) => todo.completed === false )
    setTodos(updatedTodos);
    setEditIndex(null);
  }

  const doneTodoList = () => {
    const updatedTodos = originalTodos.filter((todo) => todo.completed === true )
    setTodos(updatedTodos);
    setEditIndex(null);
  }

  const clearFilter = () => {
    setTodos([...originalTodos]);
    setEditIndex(null);
  }

  const toggleTodo = (id) => {
    const updatedTodos = [...todos];
    let index = todos.findIndex( element => {
      if (element.id === id) {
        return true
      }
    });
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
    setEditIndex(null);
  }

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return; // Item dropped outside the list
    }

    const reorderedItems = Array.from(todos);
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);

    setTodos(reorderedItems);
  };

  const getUniqueTodos = (array, key) => {
    return array.reduce((uniqueArray, currentItem) => {
      const getValue = uniqueArray.find((item) => item[key] === currentItem[key]);
      if (!getValue) {
        uniqueArray.push(currentItem);
      }else {
        let index = uniqueArray.findIndex((item) => item[key] === currentItem[key]);
        uniqueArray[index] = currentItem;
      }

      return uniqueArray;
    }, []);
  };

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
      <button onClick={resetList} disabled={todos.length === 0 ? true : false}>Reset</button>
      <br />
      <div>
        <button onClick={pendingTodoList}>Pending</button>
        <button onClick={doneTodoList}>Done</button>
        <button onClick={clearFilter}>Clear Fliter</button>
      </div>
      <br />
      {(error) ? 
        <ErrorComponent errorMessage={error} />
        : ''
      }
      {(warning) ? 
        <WarningComponent warningMessage={warning}/>
        : ''
      }
      
      <br />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sortable-list">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {getUniqueTodos(todos, 'text').map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided) => (
                    <li 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {todo.isEditing ? (
                        <div>
                          <input type="text" value={editInput} onChange={(e) => setEditInput(e.target.value)}/>
                          <button onClick={addTodo}>Save</button>
                          <button onClick={() => cancelTodo(index)}>Cancel</button>
                        </div>
                      ) : todo.isDuplicate ? (
                          <div>
                            <span
                              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                              onClick={() => toggleTodo(todo.id)}
                            >
                              {todo.text} ({todo.completedCount} Done)
                            </span>
                          </div>
                        ) 
                        : (
                          <div>
                            <span
                              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                              onClick={() => toggleTodo(todo.id)}
                            >
                              {todo.text}
                            </span>
                          </div>
                      )}
                      <button onClick={() => editTodo(index)}>Edit</button>
                      <DeleteButton onDelete={deleteTodo} deleteIndex={index} />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
