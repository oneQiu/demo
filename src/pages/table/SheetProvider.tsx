import { createContext, useState } from 'react';
import { nanoid } from 'nanoid';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Row from '@/pages/table/Row';

interface ColumnType {
  title: string;
  width: number;
  key: string;
}

interface SheetContextValue {
  columns: ColumnType[];
  data: any[];
  loading?: boolean;
  addColumn?: () => Promise<void>;
}

export const SheetContext = createContext<SheetContextValue>({
  columns: [],
  data: [],
  addColumn: async () => {},
});

const SheetProvider: RFC<{ columns: ColumnType[]; data: any[] }> = ({
  children,
  columns,
  data,
}) => {
  // 当前拖动的id
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [value, setValue] = useState<SheetContextValue>({
    columns,
    data,
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addColumn = async () => {
    setValue({
      ...value,
      columns: [
        ...columns,
        {
          key: nanoid(5),
          title: '12',
          width: 100,
        },
      ],
    });
  };

  const onDragEnd = (...arg) => {
    console.log(arg);
    setActiveId(null);
  };

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active) setActiveId(active.id);
  };

  const renderOverlay = () => {
    if (activeId) {
      const item = data.find((i) => i.id === activeId);
      if (item) return <Row data={item} />;
    }
    return null;
  };

  return (
    <SheetContext.Provider value={{ ...value, addColumn }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          strategy={verticalListSortingStrategy}
          items={data.map((d) => d.id)}
        >
          {children}
        </SortableContext>
        <DragOverlay>{renderOverlay()}</DragOverlay>
      </DndContext>
    </SheetContext.Provider>
  );
};

export default SheetProvider;
