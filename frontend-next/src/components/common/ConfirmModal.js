import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ConfirmModal = ({ title, content, onConfirm, onCancel }) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    onOk() {
      if (onConfirm) {
        onConfirm();
      }
    },
    onCancel() {
      if (onCancel) {
        onCancel();
      }
    },
    okText: 'Confirmar',
    cancelText: 'Cancelar'
  });
};

export default ConfirmModal;
