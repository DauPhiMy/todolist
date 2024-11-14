import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addTodo, cancelEdit, updateTodo } from "@/redux/TodoSlice";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

interface ModalT {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const initTodo = {
  id: "",
  task: "",
  completed: false,
};
const ModalTodo = (props: ModalT) => {
  const editTodo = useSelector((state: RootState) => state.todo.editTodo);
  const dispatch = useDispatch<AppDispatch>();
  const [todo, setTodo] = useState(initTodo);
  const { openModal, setOpenModal } = props;
  const { toast } = useToast();
  useEffect(() => {
    setTodo(editTodo || initTodo);
  }, [editTodo]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTodo) {
      dispatch(addTodo({ ...todo, id: uuidv4() }));
      toast({
        variant: "default",
        title: "✔ Thêm thành công",
      });
    } 
    else {
      dispatch(updateTodo(todo));
      toast({
        title: "✔ Sửa thành công",
      });
    }
    handleCancel();
  };
  const handleCancel = () => {
    dispatch(cancelEdit());
    setTodo(initTodo);
    setOpenModal(false);
  };
  return (
    <div>
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80"
          >
            <div className="absolute top-1/2 left-1/2 w-[300px] bg-white -translate-x-1/2 -translate-y-1/2 rounded-md">
              <h1 className="text-center font-bold text-xl mt-4">
                {editTodo ? "Update Todo" : "Add Todo"}
              </h1>
              <form
                className="m-6"
                onSubmit={handleSubmit}
                onReset={handleCancel}
              >
                <input
                  type="text"
                  className="w-full border-[#000] border rounded-md pl-4"
                  autoFocus
                  value={todo.task}
                  onChange={(e) =>
                    setTodo((prev) => ({
                      ...prev,
                      task: e.target.value,
                    }))
                  }
                />
                {!editTodo ? (
                  <div className="flex justify-between mt-5">
                    <Button type="submit">Add</Button>
                    <Button type="reset">Cancel</Button>
                  </div>
                ) : (
                  <div className="flex justify-between mt-5">
                    <Button type="submit">Update</Button>
                    <Button type="reset">Cancel</Button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ModalTodo;
