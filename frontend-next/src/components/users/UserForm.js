import { Modal, Form, Input, Button, Switch } from 'antd';

export default function UserForm({ form, setShowModal, showModal, initialValues, onSubmit }) {
  return (
    <Modal title="Usuario" visible={showModal} footer={null} onCancel={() => setShowModal(false)}>
      <Form
        form={form}
        initialValues={initialValues}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="nombre"
          label="Nombre"
          rules={[{ required: true, message: 'Por favor, introduce el nombre' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="correo"
          label="Correo electrónico"
          rules={[{ required: true, message: 'Por favor, introduce el correo electrónico' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="telefono"
          label="Teléfono"
          rules={[{ required: true, message: 'Por favor, introduce el teléfono' }]}
        >
          <Input />
        </Form.Item>

        {!form.getFieldValue('id') && (
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true, message: 'Por favor, introduce la contraseña' }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          name="esAdmin"
          label="¿Es administrador?"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {form.getFieldValue('id') ? 'Actualizar' : 'Agregar'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
