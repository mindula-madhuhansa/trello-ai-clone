import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { useBoardStore } from "@/store/BoardStore";
import { uesModalStore } from "@/store/ModalStore";

type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: "Todo",
  inprogress: "In Progress",
  done: "Done",
};

function Column({ id, todos, index }: Props) {
  const [searchString, setNewTaskType] = useBoardStore((state) => [
    state.searchString,
    state.setNewTaskType,
  ]);
  const openModal = uesModalStore((state) => state.openModal);

  const handleAddTodo = () => {
    setNewTaskType(id);
    openModal();
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                className={`p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="flex justify-between font-bold text-xl mb-2">
                  {idToColumnText[id]}
                  <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 font-normal text-sm">
                    {!searchString
                      ? todos.length
                      : todos.filter((todo) =>
                          todo.title
                            .toLowerCase()
                            .includes(searchString.toLowerCase())
                        ).length}
                  </span>
                </h2>

                <div className="space-y-2">
                  {todos.map((todo, index) => {
                    if (
                      searchString &&
                      !todo.title
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    )
                      return null;

                    return (
                      <Draggable
                        key={todo.$id}
                        draggableId={todo.$id}
                        index={index}
                      >
                        {(provided) => (
                          <TodoCard
                            todo={todo}
                            index={index}
                            id={id}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}

                  <div className="flex items-end justify-end p-2">
                    <button
                      onClick={handleAddTodo}
                      className="text-green-500 hover:text-green-600"
                    >
                      <PlusCircleIcon className="h-10 w-10" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;
