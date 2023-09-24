import React, { useState } from 'react';
import { Card, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import LoadingButton from '../components/common/LoadingButton';
import { API_URL } from '../config';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    let formData = new FormData();
    formData.append('username', values.email);
    formData.append('password', values.password);
    
    try {
      const response = await axios.post(`${API_URL}/login`, formData);
  
      Cookies.set('token', response.data.access_token);
      Cookies.set('isAdmin', response.data.es_administrador);
      Cookies.set('username', response.data.nombre);
  
      router.push('/directory');
    } catch (error) {
      message.error('Correo electrónico o contraseña incorrectos');
      setLoading(false);
    }
  };
  

  return (
    <div className="container">
      <Card className="login-card">
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <img src="/logo-cibinar.png" alt="logo" style={{ width: "200px" }} />
          <h2 style={{ marginTop: "15px" }}>Inicio de sesión</h2>
        </div>
        
        <Form onFinish={handleSubmit}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Introduce tu correo electrónico' },
              { type: 'email', message: 'Introduce un correo válido' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Correo electrónico" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Introduce tu contraseña' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <LoadingButton
              type="primary"
              loading={loading}
              block
              htmlType="submit"
            >
              Entrar
            </LoadingButton>
          </Form.Item>
        </Form>
      </Card>

      <style jsx>{`
        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)), url(/background.jpg) no-repeat center center fixed; 
          background-size: cover; 
        }

        .login-card {
          width: 300px;
          padding: 40px;
          text-align: center;
          background: #fff;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
