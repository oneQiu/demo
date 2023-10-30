import { DndContext } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 容器组件
export default function SingleTest() {
  const items = ['A', 'B', 'C'];

  const onDragEnd = (e: any) => {
    console.log(e);
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <SortableContext items={items}>
        {items.map((val) => (
          <Item id={val} key={val} />
        ))}
      </SortableContext>
    </DndContext>
  );
}

// 拖拽项组件
function Item(props: any) {
  const { id } = props;
  const { setNodeRef, listeners, transform, transition } = useSortable({ id });
  const styles = {
    transform: CSS.Transform.toString(transform),
    border: '1px solid red',
    marginTop: '10px',
  };

  return (
    <div ref={setNodeRef} {...listeners} style={styles}>
      {id}
    </div>
  );
}
