import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Cookies from "js-cookie";
import { Table, Space, Button, Avatar, Modal, Form, Input, message, Tooltip, Layout, Switch, Card, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined, UserAddOutlined, CrownOutlined, LogoutOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { API_URL } from "../config";
import md5 from "js-md5";
import axios from "axios";
import ConfirmModal from "../components/common/ConfirmModal";
import HeaderComponent from "../components/layout/Header";
import ContentComponent from "../components/layout/Content";
import SearchBar from "../components/users/SearchBar";
import UserForm from "../components/users/UserForm";
import UserTable from "../components/users/UserTable";

const { Header, Content } = Layout;
const { Search } = Input;

export default function Directory() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [esAdmin, setEsAdmin] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!Cookies.get("token")) {
      router.push("/login");
    } else {
      setEsAdmin(Cookies.get("isAdmin") === "true");
      setNombreUsuario(Cookies.get("username"));
      cargarUsuarios();
    }
  }, []);


  const showDeleteUserConfirm = (id) => {
        ConfirmModal({
            title: '¿Estás seguro?',
            icon: <ExclamationCircleOutlined />,
            content: 'No puedes deshacer esta acción.',
            onConfirm() {
                eliminarUsuario(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const showLogoutConfirm = () => {
      ConfirmModal({
          title: '¿Quieres cerrar sesión?',
          icon: <ExclamationCircleOutlined />,
          onConfirm: cerrarSesion,
          onCancel() {
            console.log('Cancel');
          },
      });
    };
     
  

  const cargarUsuarios = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/usuarios`,
        { headers: { 'Authorization': `Bearer ${Cookies.get('token')}` } }
      );

      setUsuarios(response.data);
      setFilteredUsuarios(response.data);
    } catch (error) {
      message.error('Error cargando usuarios');
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/usuarios/${id}`,
        { headers: { 'Authorization': `Bearer ${Cookies.get('token')}` } }
      );

      cargarUsuarios();
      message.success('Usuario eliminado correctamente');
    } catch (error) {
      message.error('Error eliminando usuario');
    }
  };

  const editarUsuario = async (id) => {
    const usuario = usuarios.find((usuario) => usuario.id === id);
    form.setFieldsValue(usuario);
    setShowModal(true);
  };

  const agregarUsuario = async (valores) => {
    try {
      const response = await axios.post(
        `${API_URL}/usuarios/`,
        {
          ...valores,
          contraseña: valores.password,
          es_administrador: valores.esAdmin
        },
        { headers: { 'Authorization': `Bearer ${Cookies.get('token')}` } }
      );

      setShowModal(false);
      cargarUsuarios();
      message.success('Usuario agregado correctamente');
    } catch (error) {
      message.error('Error agregando usuario');
    }
  };

  const actualizarUsuario = async (valores) => {
    try {
      const response = await axios.put(
        `${API_URL}/usuarios/${valores.id}`,
        {
          ...valores,
          es_administrador: valores.esAdmin
        },
        { headers: { 'Authorization': `Bearer ${Cookies.get('token')}` } }
      );

      setShowModal(false);
      cargarUsuarios();
      message.success('Usuario actualizado correctamente');
    } catch (error) {
      message.error('Error actualizando usuario');
    }
  };


  const updateOrAddUsuario = (valores) => {
    if (valores.id) {
      actualizarUsuario(valores);
    } else {
      agregarUsuario(valores);
    }
  };

  const cerrarSesion = () => {
    Cookies.remove('token');
    Cookies.remove('isAdmin');
    Cookies.remove('username');
    router.push('/login');
}; 

  const handleSearch = (value) => {
    const filteredData = usuarios.filter(user => 
      user.nombre.toLowerCase().includes(value.toLowerCase()) ||
      user.correo.toLowerCase().includes(value.toLowerCase()) ||
      user.telefono.toLowerCase().includes(value.toLowerCase()) 
    );
    setFilteredUsuarios(filteredData);
  }

  return (
    <Layout className="layout">
      <HeaderComponent 
        nombreUsuario={nombreUsuario}
        esAdmin={esAdmin}
        showLogoutConfirm={showLogoutConfirm}
      />
      <ContentComponent>
            <Card 
              style={{ width: "100%" }} 
              extra={
                <SearchBar 
                    handleSearch={handleSearch}
                    form={form}
                    setShowModal={setShowModal}
                    esAdmin={esAdmin}
                />
              }
            >
              <UserTable 
                usuarios={filteredUsuarios}
                showDeleteUserConfirm={showDeleteUserConfirm}
                editarUsuario={editarUsuario}
                esAdmin={esAdmin}
              />
            </Card>
            <UserForm 
              form={form} 
              setShowModal={setShowModal}
              showModal={showModal}
              initialValues={{ esAdmin: false }}
              onSubmit={updateOrAddUsuario}
            />
      </ContentComponent>
    </Layout>
  );
}