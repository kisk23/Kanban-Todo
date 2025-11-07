import { SortableContext, useSortable } from "@dnd-kit/sortable";
import Trash from "../icons/Trash";
import type { Column } from "../types";
import type { Id } from "../types";
import { CSS } from "@dnd-kit/utilities";
import {  useState ,useMemo } from "react";



import type { Task } from "../types";
import TaskCard from "./TaskCard";


interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateTitle: (id: Id, newTitle: string) => void;
    tasks: Task[];
    addNewTask: ( columnId: Id) => void;
}

const ColumnContainer = ({ column, deleteColumn , updateTitle  , tasks , addNewTask}: ColumnContainerProps) => {
     const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "COLUMN",
      column,
      disabled: editingTitle,
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
 


    const updateTask = (id: Id, content: string) => {
    tasks.map((task) => {
      if (task.id === id) {
        task.content = content;
      }
    });
  };
  const tasksids = useMemo(
    () => tasks.map((task) => task.id),
    [tasks]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col rounded-2xl bg-[var(--column-bg-color)] p-4 w-[350px] min-h-[500px] shadow-md border border-[#1e252d] "
    >
   
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between mb-4 cursor-pointer"
      >
        <h2
          className="text-lg font-semibold text-white"
          onClick={() => {
            setEditingTitle(true);
          }}
        >
          {editingTitle ? (
            <input
              value={column.title}
              onChange={(e) => updateTitle(column.id, e.target.value)}
              type="text"
              autoFocus
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setEditingTitle(false);
                }
              }}
              className="bg-[var(--column-bg-color)] text-white focus:outline-none focus:border-b-2 focus:border-rose-100 rounded-sm px-1"
            />
          ) : (
            <span
              onClick={() => setEditingTitle(true)}
              className="font-semibold cursor-pointer hover:underline decoration-rose-200"
            >
              {column.title}
            </span>
          )}
        </h2>
        <button
          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
          onClick={() => deleteColumn(column.id)}
        >
          <Trash />
        </button>
        <span className="text-sm text-gray-400">{tasks?.length || 0}</span>
      </div>

     
      <div className="flex flex-col gap-2 [#30363d] scrollbar-track-transparent">
        <SortableContext items={tasksids}>
                  {tasks && tasks.length > 0 ? (
            
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} updateTask={updateTask} />
            
          ))
        ) : (
          <div className="text-gray-500 text-sm italic text-center py-4">
            No tasks yet
          </div>
        )}

        </SortableContext>
  
        <button onClick={() => addNewTask (column.id)}> add new task</button>
      </div>
    </div>
  );
};

export default ColumnContainer;


