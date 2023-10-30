import { Button, Menu, MenuItem, styled } from '@mui/material';
import type { FC } from 'react';
import { grey } from '@mui/material/colors';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Fragment, useContext, useRef, useState } from 'react';
import Column from '@/pages/table/Column';
import { SheetContext } from '@/pages/table/SheetProvider';

// 新增按钮
const AddColumnButton = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const { addColumn } = useContext(SheetContext);

  const handlerAddClick = () => {
    setShowMenu(true);
  };

  const handlerClose = () => {
    setShowMenu(false);
  };

  const handlerItemClick = () => {
    setShowMenu(false);
    addColumn?.();
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
  display: 'flex',
  flexDirection: 'row',
  borderTop: `1px solid ${grey[300]}`,
}));

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const { columns } = useContext(SheetContext);
  // const [_columns, setColumns] = useState(context.columns);

  // 列宽度发生变化
  const onColumnWidthChange = (key: string, width: number) => {
    const columnIndex = columns.findIndex((col) => col.key === key);
    if (columnIndex > -1) {
      columns[columnIndex].width = width;
      // setColumns([...columns]);
    }
  };

  return (
    <HRow>
      {columns.map((column) => (
        <Column
          key={column.key}
          width={column.width}
          onWidthChange={(val) => onColumnWidthChange(column.key, val)}
        >
          {column.title}
        </Column>
      ))}
      <Column key={'__create'} width={100} isLastCell>
        <AddColumnButton />
      </Column>
    </HRow>
  );
};

export default Header;
