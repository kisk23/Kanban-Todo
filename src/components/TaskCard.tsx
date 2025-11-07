import { useState, useRef } from "react";
import type { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  updateTask?: (id: Id, content: string) => void;
}

const TaskCard = ({ task, updateTask }: Props) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setEditing(true)}
      className="rounded-xl bg-[var(--main-bg-color)] p-3 text text-gray-200 shadow-sm  h-20
                 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
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
          className="w-full bg-transparent border-none text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-300 rounded-md p-1"
        />
      ) : (
        <p className="break-words">{task.content}</p>
      )}
    </div>
  );
};

export default TaskCard;
