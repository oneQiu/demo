import { Box, Divider, IconButton, Typography } from '@mui/material';
import { FC } from 'react';
import { DragHandleOutlined } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Group: FC<{ label: string; items: any[]; id: string }> = ({
  label,
  id,
  items = [],
}) => {
  const {
    isDragging,
    setNodeRef,
    isSorting,
    transform,
    transition,
    attributes,
    listeners,
  } = useSortable({ id });
  console.log(isDragging, isSorting);
  return (
    <Box
      sx={{
        p: 4,
        border: '1px solid #ccc',
        margin: 4,
        transition,
        transform: CSS.Transform.toString(transform),
      }}
      ref={setNodeRef}
      {...attributes}
    >
      <Typography>
        <IconButton {...listeners}>
          <DragHandleOutlined />
        </IconButton>
        {label}
      </Typography>
      <Divider />
    </Box>
  );
};

export default Group;
