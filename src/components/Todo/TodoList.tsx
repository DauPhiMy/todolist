import { useState } from "react";
import { Button } from "../ui/button";
import ModalTodo from "./ModalTodo";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { deleteTodo, startEdit, toggleTodo } from "@/redux/TodoSlice";
import { useToast } from "@/hooks/use-toast";
import { TiPencil } from "react-icons/ti";
import { BsTrash } from "react-icons/bs";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TodoList = () => {
  const [openModal, setOpenModal] = useState(false);
  const todoList = useSelector((state: RootState) => state.todo.todoList);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [status, setStatus] = useState("All");

  const filterTodoList = todoList.filter((todo) => {
    if (status === "All") return true;
    if (status === "Completed" && todo.completed) return true;
    if (status === "Incomplete" && !todo.completed) return true;
    return false;
  });
  console.log(filterTodoList)
  return (
    <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center gap-3">
      <h1 className="font-bold text-2xl">TodoList</h1>
      <div className="flex gap-6">
        <Select value={status} onValueChange={(v) => setStatus(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Incomplete">Incomplete</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={"default"}
          onClick={() => setOpenModal(true)}
          className="grow-0"
        >
          Add
        </Button>
      </div>
      <div>
        {todoList.length > 0 ? (
          <div className="w-[500px] p-4 rounded-md mt-3 space-y-2">
            {filterTodoList.map((todo) => (
              <div
                key={todo.id}
                className="flex justify-between bg-slate-800 p-2 rounded-md"
              >
                <div
                  className={`${todo.completed && "line-through"} text-white`}
                  onClick={() => dispatch(toggleTodo(todo.id))}
                >
                  {todo.task}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setOpenModal(true);
                      dispatch(startEdit(todo.id));
                    }}
                    className="bg-blue-500 p-2 rounded-md hover:scale-110 transition-all"

                  >
                    <TiPencil />
                  </button>
                  <button
                    onClick={() => {
                      dispatch(deleteTodo(todo.id));
                      toast({
                        title: "✔ Xóa thành công",
                      });
                    }}
                    className="bg-red-500 p-2 rounded-md hover:scale-110 transition-all"
                  >
                    <BsTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>Hãy thêm nhiệm vụ</div>
        )}
      </div>
      <ModalTodo openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
};
export default TodoList;
