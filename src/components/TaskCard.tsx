import { useState, useRef } from "react";
import type { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react";

interface Props {
  task: Task;
  updateTask?: (id: Id, content: string) => void;
  deleteTask?: (id: Id) => void;
  markComplete?: (id: Id) => void;
}

const TaskCard = ({ task, updateTask, deleteTask , markComplete}: Props) => {
  console.log("task"+ JSON.stringify(task))
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(task.content);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "TASK",
      task,
      disabled: editing,
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const saveTask = () => {
    if (content.trim() && updateTask) {
      updateTask(task.id, content);
    } else {
      setContent(task.content);
    }
    setEditing(false);
  };

  const handleBlur = () => {
    saveTask();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveTask();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditing(false);
      setContent(task.content);
    }
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-xl bg-[var(--main-bg-color)] p-3 text text-gray-200 shadow-sm  h-20
                 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
      ></div>
    );
  }

  const markTaskCompleted = () => {

    if (markComplete) {
      markComplete(task.id);
    }
  
  };
const deleteTaskCard = () => {

  if (deleteTask) {
    deleteTask(task.id);
  }
};


  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group rounded-2xl p-4 transition-all duration-200 cursor-pointer select-none 
        bg-[var(--main-bg-color)] shadow-sm hover:shadow-md hover:-translate-y-1 border border-transparent 
        hover:border-rose-400/20 flex flex-col justify-between h-24`}
    >
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={content}
          autoFocus
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none text-gray-100 focus:outline-none 
                     focus:ring-2 focus:ring-rose-400 rounded-md p-1 text-sm"
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p
              className={`text-sm font-medium ${
                task.completed ? "line-through text-gray-500" : "text-gray-100"
              }`}
              onClick={() => setEditing(true)}
            >
              {task.content}
            </p>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={markTaskCompleted}
                title="Mark complete"
                className="text-rose-300 hover:text-rose-400 transition-colors"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setEditing(true)}
                title="Edit task"
                className="text-gray-400 hover:text-rose-400 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteTaskCard()}
                title="Delete task"
                className="text-gray-400 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p
            className={`text-xs mt-1 ${
              task.completed ? "text-rose-300" : "text-gray-500"
            }`}
          >
            {task.completed ? "Completed" : "Not completed"}
          </p>
        </>
      )}
    </div>
  );
};

export default TaskCard;
