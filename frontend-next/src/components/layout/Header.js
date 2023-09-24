import { Layout } from 'antd';
import { CrownOutlined, LogoutOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import Cookies from 'js-cookie';

const { Header } = Layout;

export default function HeaderComponent({nombreUsuario, esAdmin, showLogoutConfirm}) {
  return (
    <Header className="header">
      <div className="logo" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%'}}>
        <h1 style={{ color: 'white'}}>Directorio</h1>
        <div>
          {nombreUsuario && (
            <>
              { esAdmin && (<Tooltip title="Administrador"><CrownOutlined style={{color: 'gold', marginRight: '10px'}}/></Tooltip>)}
              <span style={{ color: 'white', marginRight: '8px', paddingRight: '8px', borderRight: '1px solid #707070' }}>{nombreUsuario}</span>
            </>
          )}

          <LogoutOutlined onClick={showLogoutConfirm} style={{ color: 'white'}}/>
        </div>
      </div>
    </Header>
  );
}
