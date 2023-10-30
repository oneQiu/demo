import {
  Box,
  IconButton,
  Fade,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';

const BorderTopBox = styled('div')(() => ({
  borderTop: `1px solid ${grey[300]}`,
}));

const Group: RFC<{ id: string }> = ({ children, id }) => {
  const [open, setOpen] = useState(true);
  // const {} = useDraggable({});
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const handlerMoreClick = () => {
    setOpen(!open);
  };

  return (
    <Box ref={setNodeRef}>
      <div>
        <Stack direction={'row'} alignItems={'center'}>
          <IconButton onClick={handlerMoreClick} size={'small'}>
            <ExpandMoreIcon
              sx={{
                transform: `rotate(${open ? '0' : '-90'}deg)`,
                transition: 'all .1s linear',
              }}
            />
          </IconButton>
          <Typography fontWeight={'bold'} fontSize={16} py={2}>
            Group
          </Typography>
        </Stack>
        <Fade in={open}>
          <BorderTopBox>{children}</BorderTopBox>
        </Fade>
      </div>
    </Box>
  );
};

export default Group;
