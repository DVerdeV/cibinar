import { Layout } from 'antd';

const { Content } = Layout;

export default function ContentComponent({children}) {
  return (
    <Content className="content">
      <div className="site-layout-content">{children}</div>
    </Content>
  );
}
