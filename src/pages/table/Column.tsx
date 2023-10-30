import { styled, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

const Cell = styled('div')<CellProps>((props) => ({
  textAlign: 'left',
  height: 38,
  display: 'flex',
  padding: '0 8px',
  alignItems: 'center',
  fontSize: 12,
  borderRight: props.isLastCell ? 'none' : '1px solid',
  borderBottom: '1px solid',
  borderColor: grey[300],
}));

interface CellProps {
  width?: number;
  isLastCell?: boolean;
  onWidthChange?: (val: number) => void;
}

const Column: RFC<CellProps> = ({ width, children, isLastCell }) => {
  return (
    <Cell
      sx={{ width, flexGrow: isLastCell ? 1 : undefined }}
      isLastCell={isLastCell}
    >
      <Typography noWrap fontSize={12}>
        {children}
      </Typography>
    </Cell>
  );
};

// return (
//   <Resizable
//     defaultSize={{ width: `${width}px`, height: '38px' }}
//     enable={{
//       top: false,
//       right: false,
//       bottom: false,
//       left: true,
//       topRight: false,
//       bottomRight: false,
//       bottomLeft: false,
//       topLeft: false,
//     }}
//   >
//     <Cell sx={{ width }} isLastCell={isLastCell}>
//       {children}
//     </Cell>
//   </Resizable>
// );

export default Column;
