import React, { useEffect, useRef, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SortableItem from '@/pages/gpt-list/SortableItem';
import { Button, Container, Paper } from '@mui/material';
import { cloneDeep } from 'lodash';

function SortableGroup({ id, items }) {
  const {
    transform,
    transition,
    isSorting,
    setNodeRef,
    listeners,
    attributes,
  } = useSortable({
    id,
  });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        p: 2,
        border: 1,
        minHeight: 50,
        backgroundColor: isSorting ? 'white' : undefined,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        transform: CSS.Transform.toString(transform),
        transition: transition || 'transform 300ms ease',
      }}
      {...listeners}
      {...attributes}
    >
      <SortableContext
        id={id}
        items={items}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id} />
        ))}
      </SortableContext>
    </Paper>
  );
}

function App() {
  const [groups, setGroups] = useState([
    { id: 'group-1', items: [{ id: 'item-1' }, { id: 'item-2' }] },
    { id: 'group-2', items: [{ id: 'item-3' }, { id: 'item-4' }] },
  ]);
  // 当前被拖动的id
  const [activeId, setActiveId] = useState('');
  // 判断当前是否是分组拖动
  const groupIds = groups.map((i) => i.id);
  const isContainerDrag = groupIds.includes(activeId);
  // 标记是否进入新容器
  const recentlyMovedToNewContainer = useRef<boolean | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [activeId]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log('onDragEnd');
    const fromGroupIndex = groups.findIndex((i) => i.id === active.id);
    const toGroupIndex = groups.findIndex((i) => i.id === over.id);
    // 如果是分组的移动
    const isContainerMove = fromGroupIndex > -1;
    console.log('拖动分组', isContainerMove);
    if (isContainerMove) {
      setGroups(arrayMove(groups, fromGroupIndex, toGroupIndex));
      return;
    }
    console.log('拖动行');
    if (over) {
      const activeGroupIndex = groups.findIndex((group) =>
        group.items.some((item) => item.id === active.id),
      );
      const overGroupIndex = groups.findIndex((group) =>
        group.items.some((item) => item.id === over.id),
      );
      // 没拖动的意思
      if (overGroupIndex === -1) return;
      if (activeGroupIndex === overGroupIndex) {
        // 在同一个分组内移动
        setGroups((groups) => {
          const newGroups = [...groups];
          const activeItems = newGroups[activeGroupIndex].items;
          const oldIndex = activeItems.findIndex(
            (item) => item.id === active.id,
          );
          const newIndex = activeItems.findIndex((item) => item.id === over.id);
          newGroups[activeGroupIndex].items = arrayMove(
            activeItems,
            oldIndex,
            newIndex,
          );
          return newGroups;
        });
      } else {
        // 拖动到不同的分组
        setGroups((groups) => {
          const newGroups = [...groups];
          const activeItem = newGroups[activeGroupIndex].items.find(
            (item) => item.id === active.id,
          );
          newGroups[activeGroupIndex].items = newGroups[
            activeGroupIndex
          ].items.filter((item) => item.id !== active.id);
          newGroups[overGroupIndex].items.splice(
            newGroups[overGroupIndex].items.findIndex(
              (item) => item.id === over.id,
            ) + 1,
            0,
            activeItem!,
          );
          return newGroups;
        });
      }
    }
  };

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id.toString());
    console.log('onDragStart');
  };

  const onDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;
    console.log(over);
    if (!over) return;
    const fromGroupId = active?.data.current?.sortable.containerId;
    const toGroupId = over.data.current?.sortable.containerId;
    const isDiffContainer = fromGroupId !== toGroupId;
    if (isDiffContainer) {
      console.log('onDragMove isDiffContainer');
      const fromGroupIndex = groups.findIndex((i) => i.id === fromGroupId);
      const toGroupIndex = groups.findIndex((i) => i.id === toGroupId);
      const fromIndex = groups[fromGroupIndex].items.findIndex(
        (i) => i.id === active.id,
      );
      const toIndex = groups[toGroupIndex].items.findIndex(
        (i) => i.id === over.id,
      );
      const _groups = cloneDeep(groups);
      const fromItems = _groups[fromGroupIndex].items.splice(fromIndex, 1);
      _groups[toGroupIndex].items.splice(toIndex, 0, ...fromItems);
      setGroups(_groups);
    }
    // return;
    // const activeRect = active.rect.current.translated;
    // if (activeRect) {
    //   // console.log(activeRect);
    // }
  };

  const isOverlapping = (rect1, rect2) =>
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top;

  // 渲染拖动层
  const renderOverlay = () => {
    // const isContainer = groups.findIndex((i) => i.id === activeId) > -1;
    if (isContainerDrag) {
      const group = groups.find((i) => i.id)!;
      return <SortableGroup id={group.id} items={group?.items} />;
    } else {
      const group = groups.find((i) =>
        i.items.some((it) => it.id === activeId),
      );
      const item = group?.items.find((i) => i.id === activeId);
      return <SortableItem id={item?.id} />;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    console.log('onDragOver', event);
    const { active, over, draggingRect } = event;
    const { id } = active;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  return (
    <DndContext
      sensors={sensors}
      // onDragMove={onDragMove}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <SortableContext items={groups.map((i) => i.id)}>
        <Container
          sx={{
            border: '1px dashed #ccc',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Button onClick={() => console.log(groups)}>GetCurrent</Button>
          {groups.map((group) => (
            <SortableGroup key={group.id} id={group.id} items={group.items} />
          ))}
        </Container>
        <DragOverlay>{renderOverlay()}</DragOverlay>
      </SortableContext>
    </DndContext>
  );
}

export default App;
