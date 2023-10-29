import Group from '@/pages/table/Group';
import { Container } from '@mui/material';
import Header from '@/pages/table/Header';
import { useState } from 'react';

const Table = () => {
  const [columns] = useState([
    { title: '任务名称', width: 400, key: 'taskName' },
    { title: '指派对象', width: 100, key: 'target' },
    { title: '截止日期', width: 100, key: 'date' },
    { title: '优先顺序', width: 100, key: 'sort' },
  ]);

  return (
    <Container sx={{ mt: 2 }}>
      <Header columns={columns} />
      <Group />
    </Container>
  );
};

export default Table;
