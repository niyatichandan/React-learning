import React, { useState } from 'react';
import DeleteButton from './DeleteButton.js';
import ErrorComponent from './ErrorComponent.js';
import WarningComponent from './WarningComponent.js';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ToDosProvider } from './ToDosContext';
import TodoReport from './TodoReport.js';

const ToDoComponent = () => {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState('');
  const [originalTodos, setOriginalTodos] = useState([...todos]);
  const [input, setInput] = useState('');
  const [editInput, setEditInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState();
  const [warning, setWarning] = useState();
  const [active, setActive] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    setError();
    
    if ( editIndex !== null ) {
      const updatedTodos = [...todos];
      let index = updatedTodos.findLastIndex( element => {
        if (element.text === editInput) {
          return true;
        }
        return false;
      });

      if ( updatedTodos[editIndex].isDuplicate ) {
        if( index === -1 ){
          updatedTodos.map( (element,index) => {
            if(element.text === updatedTodos[editIndex].text) { 
              updatedTodos[index] = {id: updatedTodos[index].id, text: editInput, isEditing: false, completed: updatedTodos[index].completed, completedCount: updatedTodos[index].completedCount, isDuplicate: updatedTodos[index].isDuplicate, user: updatedTodos[index].user};
            }
          });
        }else{
          if ( updatedTodos[index].completed === true ) {
            let completedCount = updatedTodos[editIndex].completedCount + 1;
            updatedTodos.map( (element,index) => {
              if(element.text === updatedTodos[editIndex].text) { 
                updatedTodos[index] = {id: updatedTodos[index].id, text: editInput, isEditing: false, completed: updatedTodos[index].completed, completedCount: completedCount, isDuplicate: updatedTodos[index].isDuplicate, user: updatedTodos[index].user};
              }
            });
          }else{
            updatedTodos[editIndex] = {id: updatedTodos[editIndex].id, text: updatedTodos[editIndex].text, isEditing: false, completed: updatedTodos[editIndex].completed, completedCount: updatedTodos[editIndex].completedCount, isDuplicate: updatedTodos[editIndex].isDuplicate, user: updatedTodos[editIndex].user };
            setError({message: 'There is already duplicate pending item in the list'});
          }
        }
      }else{
        if( index === -1 ){
          updatedTodos[editIndex] = {id: updatedTodos[editIndex].id, text: editInput, isEditing: false, completed: updatedTodos[editIndex].completed, completedCount: updatedTodos[editIndex].completedCount, isDuplicate: updatedTodos[editIndex].isDuplicate, user: updatedTodos[editIndex].user };
        }else{
          if ( updatedTodos[index].completed === true ) {
            let completedCount = updatedTodos[index].completedCount + 1;
            updatedTodos[index] = {id: updatedTodos[index].id, text: editInput, isEditing: false, completed: updatedTodos[index].completed, completedCount: completedCount, isDuplicate: true, user: updatedTodos[index].user };
            updatedTodos[editIndex] = {id: updatedTodos[editIndex].id, text: editInput, isEditing: false, completed: updatedTodos[editIndex].completed, completedCount: completedCount, isDuplicate: true, user: updatedTodos[editIndex].user };
          }else {
            updatedTodos[editIndex] = {id: updatedTodos[editIndex].id, text: updatedTodos[editIndex].text, isEditing: false, completed: updatedTodos[editIndex].completed, completedCount: updatedTodos[editIndex].completedCount, isDuplicate: updatedTodos[editIndex].isDuplicate, user: updatedTodos[editIndex].user };
            setError({message: 'There is already duplicate pending item in the list'});
          }
        }
      }
      setTodos(updatedTodos);
      setOriginalTodos(updatedTodos);
      setEditInput('');
      setEditIndex(null);
      setWarning();
    } else{
      let index = todos.findLastIndex( element => {
        if (element.text === input) {
          return true;
        }
        return false;
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
        const newTodo = { id: todoId.toString(), text: input, isEditing: false, completed: false, completedCount: completedCount, isDuplicate: duplicateValue, user: user };
        
        setTodos([...todos, newTodo]);
        setOriginalTodos([...todos, newTodo]);
        setInput('');
        setUser('');
      }else{
        setError({message: 'There is already a pending item'});
      }
    };
  };

  const editTodo = (id) => {
    setError();
    const updatedTodos = [...todos];
    updatedTodos.map(( element ) => element.isEditing = false);
    let index = returnIndex(id);
    updatedTodos[index].isEditing = true;
    setTodos(updatedTodos);
    setEditInput(updatedTodos[index].text);
    setEditIndex(index);
    updatedTodos[index].isDuplicate ? setWarning({message: 'All the duplicate Todo items will be impacted on editing'}) : setWarning();
  };

  const cancelTodo = (id) => {
    const updatedTodos = [...todos];
    let index = returnIndex(id);
    updatedTodos[index].isEditing = false;
    setTodos(updatedTodos);
    setEditInput('');
    setEditIndex(null);
    setWarning();
  };

  const deleteTodo = (id) => {

    let updatedTodos = [];
    let index = returnIndex(id);
    if ( todos[index].isDuplicate ) {
      setWarning();
      let duplicateElementIndexes = [];
      debugger
      todos.map( (element,i) => {
        if(element.text === todos[index].text){ 
          duplicateElementIndexes.push(i)
        } 
        return null;
      });

      updatedTodos = todos.filter((item, index) => !duplicateElementIndexes.includes(index));
    }else{
      updatedTodos = todos.filter((_,i) => i !== index )
    }
    setTodos(updatedTodos);
    setOriginalTodos(updatedTodos);
    setEditIndex(null);
    console.log("Item deleted");
  };

  const resetList = () => {
    setTodos([]);
    setOriginalTodos([]);
    setEditIndex(null);
    setActive();
  }

  const pendingTodoList = (event) => {
    const updatedTodos = originalTodos.filter((todo) => todo.completed === false )
    setTodos(updatedTodos);
    setEditIndex(null);
    setActive(event.target.id);
  }

  const doneTodoList = (event) => {
    const updatedTodos = originalTodos.filter((todo) => todo.completed === true )
    setTodos(updatedTodos);
    setEditIndex(null);
    setActive(event.target.id);
  }

  const clearFilter = (event) => {
    setTodos([...originalTodos]);
    setEditIndex(null);
    setActive(event.target.id);
  }

  const filterBasedOnUser = (value) => {
    const updatedTodos = originalTodos.filter((todo) => todo.user === value )
    setTodos(updatedTodos);
    setEditIndex(null);
    setActive(value);
  }

  const returnIndex = (id) => {
    let index = todos.findIndex( element => {
        if (element.id === id) {
          return true;
        }
        return false;
      });
    return index;
  }

  const getObject = (key, value) => {
    return todos.find((item) => item[key] === value)
  }

  const toggleTodo = (id) => {
    const updatedTodos = [...todos];
    let index = returnIndex(id);
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
        if(currentItem['completed'] === false) {
          uniqueArray[index] = currentItem;
        }
      }

      return uniqueArray;
    }, []);
  };

  const getUniqueUsers = (array, key) => {
    return array.reduce((uniqueArray, currentItem) => {
      const getValue = uniqueArray.find((item) => item[key] === currentItem[key]);
      if (!getValue) {
        if (currentItem[key] !== "") {
          uniqueArray.push(currentItem);
        };
      }

      return uniqueArray;
    }, []);
  };

  return (
    <div>
      <ToDosProvider value={originalTodos}>
        <br />
        <div>
          <form onSubmit={addTodo}>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="add item..."/>&nbsp;
            <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="add user"/>&nbsp;
            <button type="submit" disabled={input ? false : true}>Add</button>&nbsp;
          </form>
        </div>
        <br />
        <div>
          <button onClick={resetList} disabled={originalTodos.length === 0 ? true : false} >Reset TODO</button>
        </div>
        <br />
        <div>
          <button key={3} className={undefined} id={"3"} onClick={clearFilter}>Clear Fliters</button>&nbsp;
          <button key={1} className={active === "1" ? "active" : undefined} id={"1"} onClick={pendingTodoList}>Pending</button>&nbsp;
          <button key={2} className={active === "2" ? "active" : undefined} id={"2"} onClick={doneTodoList}>Done</button>&nbsp;
          {getUniqueUsers(originalTodos, 'user').map((user, index) => (
            <button key={user.user} className={active === user.user ? "active" : undefined} id={user.user} onClick={() => filterBasedOnUser(user.user)}>{user.user}</button>
          ))}
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
                            <input type="text" value={editInput} onChange={(e) => setEditInput(e.target.value)}/>&nbsp;
                            <button onClick={addTodo}>Save</button>&nbsp;
                            <button onClick={() => cancelTodo(todo.id)}>Cancel</button>&nbsp;
                          </div>
                        ) : todo.isDuplicate ? (
                            <span
                              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                              onClick={() => toggleTodo(todo.id)}
                            >
                              {todo.text} ({todo.completedCount} Done) &nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                          ) 
                          : (
                            <span
                              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                              onClick={() => toggleTodo(todo.id)}
                            >
                              {todo.text} &nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                        )}
                        <button onClick={() => editTodo(todo.id)}>Edit</button> &nbsp;
                        <DeleteButton onDelete={deleteTodo} deleteIndex={todo.id} />
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <hr />
        <TodoReport />
      </ToDosProvider>
    </div>
  );
};

export default ToDoComponent;