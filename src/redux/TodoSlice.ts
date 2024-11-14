import { createSlice } from "@reduxjs/toolkit";

export type TodoListT = {
  id: string;
  task: string;
  completed: boolean;
};
type initT = {
  todoList: TodoListT[];
  editTodo: null | TodoListT;
  filter: {
    status: string
  }
};

const fetchLocalStorage = () => {
  const todoList = localStorage.getItem('todoList')
  if(todoList) {
    return JSON.parse(todoList)
  } else {
    return []
  }
}

const todoInLocalStorage = (todo:TodoListT[]) => {
  localStorage.setItem('todoList',JSON.stringify(todo))
}
const initialState: initT = {
  todoList: fetchLocalStorage(),
  editTodo: null,
  filter: {
    status:'All'
  }
};

const TodoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.todoList= [action.payload,...state.todoList];
      todoInLocalStorage(state.todoList)
    },
    startEdit: (state, action) => {
      const findTodo =
        state.todoList.find((todo) => todo.id === action.payload) || null;
      state.editTodo = findTodo;
      console.log(findTodo);
    },
    cancelEdit: (state) => {
      state.editTodo = null;
    },
    updateTodo: (state, action) => {
      const indexTodo = state.todoList.findIndex(
        (todo) => todo.id === action.payload.id
      );
      state.todoList[indexTodo] = action.payload;
      todoInLocalStorage(state.todoList)
    },
    deleteTodo: (state, action) => {
      const newTodo = state.todoList.filter(
        (todo) => todo.id !== action.payload
      );
      state.todoList = newTodo
      todoInLocalStorage(state.todoList)
    },
    toggleTodo: (state,action) => {
      const indexTodo = state.todoList.findIndex(
        (todo) => todo.id === action.payload
      );
      state.todoList[indexTodo].completed = !state.todoList[indexTodo].completed;
      todoInLocalStorage(state.todoList)
    },
    statusTodo: (state,action) => {
      state.filter.status = action.payload
    } 
  },
});

export const { addTodo, startEdit, cancelEdit, updateTodo, deleteTodo,toggleTodo,statusTodo } =
  TodoSlice.actions;
export default TodoSlice.reducer;
