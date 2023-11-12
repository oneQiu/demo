import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Paper } from '@mui/material';

function SortableItem({ id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    transform,
    transition = 'transform .3s ease',
  } = useSortable({ id });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        height: 50,
        width: 100,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
        background: 'white',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::after': isDragging
          ? {
              content: '""',
              position: 'absolute',
              border: '1px dashed red',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
            }
          : undefined,
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      {id}
    </Paper>
  );
}

export default SortableItem;
