import React, { useContext } from 'react'
import ToDosContext from './ToDosContext'

const TodoReport = props => {
  const todos = useContext(ToDosContext);

  const getCounts = (todos) => {
    const pendingCount = todos.filter((todo) => !todo.completed).length;
    const doneCount = todos.filter((todo) => todo.completed).length;
    return { pendingCount, doneCount };
  };

  return (
    <div>
      <h2>Todo Report</h2>
      <p>Pending Todos: {getCounts(todos).pendingCount}</p>
      <p>Done Todos: {getCounts(todos).doneCount}</p>
    </div>
  );
};

export default TodoReport;
