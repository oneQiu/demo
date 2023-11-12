import { useState } from 'react';
import { Box, Container } from '@mui/material';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import Group from '@/pages/dnd/Group';

const initialItems = [
  {
    label: '分组一',
    key: 'group_1',
    children: [
      { label: '项目一', key: 'item_1' },
      { label: '项目二', key: 'item_2' },
      { label: '项目三', key: 'item_3' },
    ],
  },
  {
    label: '分组二',
    key: 'group_2',
    children: [
      { label: '项目三', key: 'item_3' },
      { label: '项目四', key: 'item_4' },
      { label: '项目五', key: 'item_5' },
    ],
  },
];
export default () => {
  const [items, setItems] = useState(initialItems);

  return (
    <Container>
      <DndContext>
        <SortableContext items={items.map((i) => i.key)}>
          {items.map((i) => (
            <Group key={i.key} label={i.label} id={i.key} items={i.children} />
          ))}
        </SortableContext>
      </DndContext>
    </Container>
  );
};
