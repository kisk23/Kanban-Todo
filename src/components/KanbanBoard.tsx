import { PlusIcon } from "../icons/PlusIcon";
import { useState } from "react";
import type { Column } from "../types";
import ColumnConatiner from "./ColumnConatiner";
import type { Id } from "../types";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensors,
  useSensor,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useMemo } from "react";
import type { DragStartEvent } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import { createPortal } from "react-dom";
import type { Task } from "../types";
import TaskCard from "./TaskCard";
import { arrayMove } from "@dnd-kit/sortable";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const columnsId = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const createNewColumn = () => {
    const newColumn: Column = {
      id: Date.now(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, newColumn]);
  };
  const deleteColumn = (id: Id) => {
    setColumns(columns.filter((column) => column.id !== id));
  };
  console.log(columns);
  const onDragStart = (event: DragStartEvent) => {
    const activeType = event.active.data.current?.type;

    if (activeType === "COLUMN") {
      const column = event.active.data.current?.column;
      if (column) setActiveColumn(column);
      return;
    }

    if (activeType === "TASK") {
      const task = event.active.data.current?.task;
      if (task) setActiveTask(task);
      return;
    }
  };
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "COLUMN" && overType === "COLUMN") {
      if (active.id === over.id) return;
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);
      setColumns((cols) => arrayMove(cols, oldIndex, newIndex));
    }

    if (activeType === "TASK") {
      const activeTask = active.data.current?.task;
      if (!activeTask) return;

      setTasks((tasks) => {
        const updated = [...tasks];
        const oldIndex = updated.findIndex((t) => t.id === activeTask.id);
        const oldTask = updated[oldIndex];
        if (!oldTask) return updated;

        const overTask = over.data.current?.task;
        const overColumn = over.data.current?.column;

        let newColumnId: Id = oldTask.columnId;

        if (overTask) newColumnId = overTask.columnId;
        else if (overColumn) newColumnId = overColumn.id;
        else return updated;

        updated[oldIndex] = { ...oldTask, columnId: newColumnId };

        const sameColumnTasks = updated.filter(
          (t) => t.columnId === newColumnId
        );
        const ordered = sameColumnTasks.map((t) => t.id);
        const newIndex = ordered.indexOf(over.id);

        if (newIndex >= 0 && newColumnId === oldTask.columnId) {
          return arrayMove(updated, oldIndex, newIndex);
        }

        return updated;
      });
    }

    setActiveColumn(null);
    setActiveTask(null);
  };
  const updateTitle = (id: Id, newTitle: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === id ? { ...column, title: newTitle } : column
      )
    );
  };
  const addNewTask = (columnId: Id) => {
    const newTask: Task = {
      id: Date.now(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  };
  console.log(tasks);
  return (
    <div className=" flex  min-h-screen  items-center  overflow-x-auto overflow-y-hidden  ">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="m-auto  bg-[var(--main-bg-color)] flex gap-1">
          <div className="flex flex-wrap gap-3 flex-1">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <div key={column.id} className="flex gap-2">
                  <ColumnConatiner
                    column={column}
                    tasks={tasks.filter((task) => task.columnId === column.id)}
                    deleteColumn={deleteColumn}
                    updateTitle={updateTitle}
                    addNewTask={addNewTask}
                  />
                </div>
              ))}
            </SortableContext>
          </div>

          <button
            className="h-[60px] w-[350px] cursor-pointer rounded-2xl flex items-center justify-center gap-3 "
            onClick={createNewColumn}
          >
            <PlusIcon />
            Add New Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn ? (
              <ColumnConatiner
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateTitle={updateTitle}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                addNewTask={addNewTask}
              />
            ) : null}

            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
