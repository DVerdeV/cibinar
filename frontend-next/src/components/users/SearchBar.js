import { Input, Space, Button } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

const { Search } = Input;

export default function SearchBar({ handleSearch, form, setShowModal, esAdmin }) {
  const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });
  return (
    <Space align="end">
      <Search
        placeholder="Buscar..."
        allowClear
        onSearch={handleSearch}
        style={{ width: 200 }}
        enterButton
      />
      {esAdmin && (
        <Button 
          key="1"
          type="primary"
          onClick={() => { form.resetFields(); setShowModal(true); }}
          style={{ paddingRight: isSmallScreen ? '8px' : undefined }}
        >
          <UserAddOutlined /> {!isSmallScreen && "Añadir"}
        </Button>    
      )}
    </Space>
  );
}
