import axios from "axios";
import React, { useEffect, useState } from "react";
import { getTodos, patchTodo } from "../utils/api";
import Todo from "./Todo";
import TodoForm from "./TodoForm";

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    document.title = 'To-do App';
    getTodos().then((remoteTodos) => {
      setTodos(remoteTodos)
    })
  }, []);

  const addTodo = async (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    axios.post("http://localhost:3000/api/v1/to-dos", {
      ... todo,
      title: todo.text,
    }).then(() => {
      getTodos().then((remoteTodos) => {
        setTodos(remoteTodos)
      })
    });
  };

  const showDescription = (todoId) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.showDescription = !todo.showDescription;
      }
      return todo;
    });
    
    setTodos(updatedTodos);
  }

  const updateTodo = (todoId, newValue) => {

    patchTodo(todoId, newValue).then(() => {
      getTodos().then((remoteTodos) => {
        setTodos(remoteTodos)
      });
    });
  };

  // UPDATE DESCRIPTION --------------

  const updateDescription = (id, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }
    axios.patch(`http://localhost:3000/api/v1/to-dos/${id}`).then(() => {
      
      patchTodo(id, newValue).then(() => {
        getTodos().then((remoteTodos) => {
          setTodos(remoteTodos)
        });
      });
      
    })
  }

  const removeTodo = (id) => {
    axios.delete(`http://localhost:3000/api/v1/to-dos/${id}`).then(() => {
      getTodos().then((remoteTodos) => {
        setTodos(remoteTodos)
      });
    });

  };

  const completeTodo = (id) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.is_done = !todo.is_done;

        patchTodo(id, { ... todo})
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}

        updateDescription={updateDescription}
      />
      <p className="myName">Author: Leonardo Guevara - Project for CoreCode.io Software Development Fundamentals</p>
    </>
  );
}

export default TodoList;
