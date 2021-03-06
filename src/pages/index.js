import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./index.module.css";
import Form from "../components/form";
import Todo from "../components/todo";

export default () => {
  const [status, setStatus] = useState("loading");
  const [todos, setTodos] = useState(null);

  const reloadTodos = () => setStatus("loading");

  useEffect(() => {
    let canceled = false;

    if (status !== "loading") return;

    axios.get("/api/get-all-todos").then((result) => {
      if (canceled === true) return;

      if (result.status !== 200) {
        console.error("Error loading todos.");
        console.error(result);
        return;
      }

      setTodos(result.data.todos);
      setStatus("loaded");
    });

    return () => {
      canceled = true;
    };
  }, [status]);

  return (
    <main>
      <h1 className={styles.heading}>JAMstack Todos</h1>
      <Form reloadTodos={reloadTodos}></Form>
      {todos ? (
        <ul className={styles.todos}>
          {todos.map((todo) => (
            <li key={todo._id} className={styles.todo}>
              <Todo reloadTodos={reloadTodos} todo={todo}></Todo>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loaging</p>
      )}
    </main>
  );
};
