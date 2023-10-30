import Group from '@/pages/table/Group';
import { Container } from '@mui/material';
import Header from '@/pages/table/Header';
import { useState } from 'react';
import Row from '@/pages/table/Row';
import SheetProvider from '@/pages/table/SheetProvider';
import DragWrapper from '@/pages/table/DragWrapper';

const Table = () => {
  const [columns] = useState([
    { title: '任务名称', width: 400, key: 'taskName' },
    { title: '指派对象', width: 100, key: 'target' },
    { title: '截止日期', width: 100, key: 'date' },
    { title: '优先顺序', width: 100, key: 'sort' },
  ]);
  const [data] = useState([
    {
      taskName: '任务一',
      target: 'QiuQiu',
      date: '2020-09-10 10:20',
      sort: 1,
      id: 'qqq',
    },
    {
      taskName: '任务二',
      target: 'QiuQiu',
      date: '2020-09-10 12:20',
      sort: 2,
      id: 'www',
    },
  ]);

  return (
    <Container sx={{ mt: 2 }}>
      <SheetProvider columns={columns} data={data}>
        <Header />
        <Group id={'group1'}>
          {data.map((i) => (
            <DragWrapper id={i.id} key={i.id}>
              <Row data={i} />
            </DragWrapper>
          ))}
        </Group>
      </SheetProvider>
    </Container>
  );
};

export default Table;
