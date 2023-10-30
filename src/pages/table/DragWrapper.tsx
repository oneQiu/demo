import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { grey } from '@mui/material/colors';
// import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const DragWrapper: RFC<{ id: string }> = ({ children, id }) => {
  const {
    attributes,
    listeners,
    isDragging,
    transform,
    transition,
    setNodeRef,
  } = useSortable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        cursor: isDragging ? 'grabbing' : 'grab',
        borderTop: isDragging ? `1px solid ${grey[200]}` : 'none',
        transition,
        zIndex: isDragging ? 10 : 1,
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
};

export default DragWrapper;
