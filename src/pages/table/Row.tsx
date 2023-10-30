import { styled } from '@mui/material';
import { FC, useContext } from 'react';
import { SheetContext } from '@/pages/table/SheetProvider';
import Column from '@/pages/table/Column';

const RowBox = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  background: 'white',
}));

/**
 * 行
 */
const Row: FC<{ data: AnyObj }> = ({ data }) => {
  const { columns } = useContext(SheetContext);

  return (
    <RowBox>
      {columns.map((i) => (
        <Column key={i.key} width={i.width}>
          {data[i.key]}
        </Column>
      ))}
      <Column key={'empty'} isLastCell />
    </RowBox>
  );
};

export default Row;
