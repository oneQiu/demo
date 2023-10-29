import { Button, Menu, MenuItem, styled } from '@mui/material';
import type { FC, ReactNode } from 'react';
import { grey } from '@mui/material/colors';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Resizable } from 're-resizable';
import { Fragment, useRef, useState } from 'react';

const Cell = styled('div')<HCellProps>((props) => ({
  textAlign: 'left',
  height: 38,
  display: 'flex',
  padding: '0 8px',
  alignItems: 'center',
  fontSize: 12,
  borderRight: props.isLastCell ? 'none' : '1px solid',
  borderTop: '1px solid',
  borderColor: grey[300],
}));

interface HCellProps {
  children?: ReactNode;
  width?: number;
  isLastCell?: boolean;
  onWidthChange?: (val: number) => void;
}

const HCell: FC<HCellProps> = ({
  width,
  children,
  isLastCell,
  onWidthChange,
}) => {
  return (
    <Cell sx={{ width }} isLastCell={isLastCell}>
      {children}
    </Cell>
  );
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
};

// 新增按钮
const AddColumnButton = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  const handlerAddClick = () => {
    setShowMenu(true);
  };

  const handlerClose = () => {
    setShowMenu(false);
  };

  const handlerItemClick = () => {
    setShowMenu(false);
  };

  return (
    <Fragment>
      <Button
        ref={ref as any}
        size={'small'}
        sx={{ minWidth: 30 }}
        onClick={handlerAddClick}
      >
        <AddOutlinedIcon sx={{ fontSize: 16 }} />
      </Button>
      <Menu open={showMenu} onClose={handlerClose} anchorEl={ref.current}>
        <MenuItem sx={{ fontSize: 12 }} onClick={handlerItemClick}>
          创建主题
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

const HRow = styled('div')(() => ({
  display: 'inline-flex',
  flexDirection: 'row',
  borderBottom: `1px solid ${grey[300]}`,
}));

interface HeaderProps {
  columns: { key: string; width: number; title: string }[];
}

const Header: FC<HeaderProps> = ({ columns }) => {
  const [_columns, setColumns] = useState(columns);

  // 列宽度发生变化
  const onColumnWidthChange = (key: string, width: number) => {
    const columnIndex = _columns.findIndex((col) => col.key === key);
    if (columnIndex > -1) {
      _columns[columnIndex].width = width;
      setColumns([..._columns]);
    }
  };

  return (
    <HRow>
      {_columns.map((column) => (
        <HCell
          key={column.key}
          width={column.width}
          onWidthChange={(val) => onColumnWidthChange(column.key, val)}
        >
          {column.title}
        </HCell>
      ))}
      <HCell key={'__create'} width={100} isLastCell>
        <AddColumnButton />
      </HCell>
    </HRow>
  );
};

export default Header;
