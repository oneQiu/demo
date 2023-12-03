import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Box, Button, Container } from '@mui/material';
import { useState } from 'react';
import data from '@/pages/cbi/list/data';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { DragHandleOutlined } from '@mui/icons-material';
import { CSS } from '@dnd-kit/utilities';

const Item = ({ name, id }) => {
  const {
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({ id });

  return (
    <Box
      bgcolor={'info.light'}
      p={2}
      ref={setNodeRef}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : undefined,
      }}
      {...attributes}
    >
      <Button
        variant={'contained'}
        sx={{ minWidth: 42, mr: 2 }}
        size={'small'}
        color={'warning'}
        {...listeners}
      >
        <DragHandleOutlined />
      </Button>
      项目 - {name}
    </Box>
  );
};

const Group = ({ item }) => {
  const { id, name, children } = item;
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext
      items={children.map((i) => i.id)}
      strategy={verticalListSortingStrategy}
    >
      <Box
        m={2}
        p={2}
        key={id}
        border={'1px dashed #ccc'}
        borderColor={'warning.light'}
        sx={{ transition: 'all .2s linear' }}
        display={'flex'}
        gap={2}
        flexDirection={'column'}
      >
        <h2>{name}</h2>
        {children.map((i) => (
          <Item name={i.name} id={i.id} key={i.id} />
        ))}
      </Box>
    </SortableContext>
  );
};

const List = () => {
  const [list, setList] = useState(data); // 列表数据
  const [active, setActive] = useState<any>(null); // 当前拖拽的元素
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findItemById = (id: string) => {
    for (const { children } of list) {
      const activeItem = children.find((i) => i.id === id);
      if (activeItem) return activeItem;
    }
    return null;
  };

  const findGroupIndex = (id: string) =>
    data.findIndex((i) => !!i.children.find((c) => c.id === id));

  const onDragStart = (event: DragStartEvent) => {
    setActive(event.active.id);
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActive(null);
    const { active, over } = event;
    if (over?.id) {
      const containerIdx = findGroupIndex(active.id as string);
      const newData = [...data];
      const { children } = newData[containerIdx];
      const activeIdx = children.findIndex((i) => i.id === active.id);
      const overIdx = children.findIndex((i) => i.id === over.id);
      newData[containerIdx].children = arrayMove(children, activeIdx, overIdx);
      setList(newData);
    }
  };

  const onDragOver = (event: DragMoveEvent) => {
    const { active, over, collisions } = event;
    const activeContainerIdx = findGroupIndex(active.id as string);
    const overContainerIdx = findGroupIndex(over?.id as string);
    console.log(active, over, collisions);
    // 跨容器判定
    if (over?.id && activeContainerIdx !== overContainerIdx) {
      console.log(data, activeContainerIdx, overContainerIdx);
      const activeIndex = data[activeContainerIdx].children.findIndex(
        (i) => i.id === active.id,
      );
      const overIndex = data[overContainerIdx].children.findIndex(
        (i) => i.id === over.id,
      );
      const newData = [...data];
      // 移动到新容器
      newData[overContainerIdx].children.splice(
        overIndex,
        0,
        ...newData[activeContainerIdx].children.splice(activeIndex, 1),
      );
      setList(newData);
    }
  };

  const activeItem = findItemById(active);

  return (
    <Container>
      <h3>List 无分层</h3>
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={onDragOver}
        sensors={sensors}
      >
        {list.map((i) => (
          <Group item={i} key={i.id} />
        ))}
        <DragOverlay>
          {activeItem && <Item name={activeItem.name} id={activeItem.id} />}
        </DragOverlay>
      </DndContext>
    </Container>
  );
};

export default List;
