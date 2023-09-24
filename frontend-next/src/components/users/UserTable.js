import { Table, Avatar, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import md5 from 'js-md5';

export default function UserTable({ usuarios, showDeleteUserConfirm, editarUsuario, esAdmin }) {
  let columnas = [
    {
      title: 'Avatar',
      dataIndex: 'correo',
      key: 'avatar',
      render: (text, record) => (
        <Space size="middle">
          <Avatar src={`https://www.gravatar.com/avatar/${md5(record.correo)}}`} />
        </Space>
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Correo Electrónico',
      dataIndex: 'correo',
      key: 'correo',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
  ];

  if (esAdmin) {
    columnas.push({
      title: 'Operaciones',
      key: 'operaciones',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editarUsuario(record.id)}>
            <EditOutlined />
          </Button>
          <Button type="primary" danger onClick={() => showDeleteUserConfirm(record.id)}>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    });
  }

  return (
    <Table columns={columnas} dataSource={usuarios} className="tabla-usuarios" rowKey="id" scroll={{ x: 'max-content' }} /> 
  );
}
