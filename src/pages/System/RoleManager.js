import React from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Divider,
  TreeSelect, Popconfirm,
} from 'antd';

const { SHOW_PARENT } = TreeSelect;
const FormItem = Form.Item;
const { Option } = Select;

const treeData = [
  {
    title: '全部页面',
    value: '0',
    key: '0',
    children: [
      {
        title: '班课管理',
        value: '0-0',
        key: '0-0',
      },
      {
        title: '我的班课',
        value: '0-1',
        key: '0-1',
      },
      {
        title: '个人页',
        value: '0-2',
        key: '0-2',
        children: [
          {
            title: '个人设置',
            value: '0-2-1',
            key: '0-2-1',
          },
        ],
      },
      {
        title: '系统管理',
        value: '0-3',
        key: '0-3',
        children: [
          {
            title: '用户管理',
            value: '0-3-1',
            key: '0-3-1',
          },
          {
            title: '菜单管理',
            value: '0-3-2',
            key: '0-3-2',
          },
          {
            title: '角色管理',
            value: '0-3-3',
            key: '0-3-3',
          },
        ],
      },
      {
        title: '标准页',
        value: '0-4',
        key: '0-4',
        children: [
          {
            title: '标准空白页',
            value: '0-4-1',
            key: '0-4-1',
          },
          {
            title: '标准表单页',
            value: '0-4-2',
            key: '0-4-2',
          },
          {
            title: '标准卡片页',
            value: '0-4-3',
            key: '0-4-3',
          },
          {
            title: '标准列表页',
            value: '0-4-4',
            key: '0-4-4',
          },
        ],
      },
    ]
  }
];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

const validatorUniqueKey = (rule, value, callback) => {
  if (value == 'admin' || value == 'teacher' || value == 'student') {
    callback('Unique key must unique!');
  }
  callback();
};

@connect(({ role, rule, loading }) => ({
  role,
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class RoleManager extends React.Component {
  state = {
    selectValue: ['0'],
    currentData: {
      id: 0,
      name: '管理员',
      uniqeKey: 'admin',
      note: '拥有所有权限',
      status: '0'
    },
  };

  constructor(props) {
    super(props);

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  
    this.loadRoleList(props);
  }
  
  loadRoleList = props => {
    const { dispatch } = props;
    dispatch({
      type: 'role/queryRoles',
      payload: {},
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({});

    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({});

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        address: fields.address,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  onChange = value => {
    this.setState({ selectValue: value });
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { currentData } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(currentData.id != undefined) {
          dispatch({
            type: 'role/updateRole',
            payload: {
              ...values,
              id: currentData.id
            },
          });
          message.success('更新成功');
          setTimeout(function () {
            window.location.reload();
          },500);
        } else {
          dispatch({
            type: 'role/insertRole',
            payload: values,
          });
          message.success('插入成功');
          setTimeout(function () {
            window.location.reload();
          },500);
        }
      }
    });
  };
  
  refreshData = id => {
    if(id == 'new') {
      this.setState({ currentData: {}});
      this.setState({ selectValue: []});
    } else {
      const {role} = this.props;
      role.list.forEach( (value) => {
        if(value.id == id) {
          this.setState({ currentData: value});
        }
      });
      if (id == 0) {
        this.setState({ selectValue: ['0']});
      } else if(id == 1) {
        this.setState({ selectValue: ['0-0','0-2']});
      } else if(id == 2) {
        this.setState({ selectValue: ['0-1','0-2']});
      }
    }
  };
  
  roleLeftList = roleList => {
    let x = [];
    if(roleList) {
      roleList.forEach( (value) => {
        x.push(
          <Row key={value.id}>
            <Card
              hoverable
              bordered={false}
              onClick={() => this.refreshData(value.id)}
              style={{ textAlign: 'center' }}
            >
              <h2>value.name</h2>
              <span style={{ fontSize: 15 }}>value.note</span>
            </Card>
          </Row>
        );
        x.push(<Divider key={value.id + 100} />);
      });
    }
    x.push(
      <Row key={-1}>
        <Card
          hoverable
          bordered={false}
          onClick={() => this.refreshData('new')}
          style={{ textAlign: 'center' }}
        >
          <h2>新增角色</h2>
          <span style={{ fontSize: 15 }}>新增一个角色</span>
        </Card>
      </Row>
    );
    return x;
  };
  
  deleteRole = () => {
    const {dispatch} = this.props;
    const {currentData} = this.state;
    dispatch({
      type: 'role/deleteRole',
      payload: currentData.id,
    });
    message.success("删除成功");
    setTimeout(function () {
      window.location.reload();
    },500);
  };
  
  render() {
    const {
      form: { getFieldDecorator },
      role
    } = this.props;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const { modalVisible, selectValue, currentData } = this.state;
    const tProps = {
      treeData,
      value: selectValue,
      onChange: this.onChange,
      multiple: true,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select',
      style: {
        width: 300,
      },
    };
    return (
      <PageHeaderWrapper title="角色管理">
        <Card bordered={false}>
          <Col sm={4} xs={24}>
            {this.roleLeftList(role.list)}
          </Col>
          <Col sm={20} xs={24} style={{ paddingLeft: 20 }}>
            <h3>角色：{currentData.name}</h3>
            <Form layout="vertical" onSubmit={this.handleSubmit}>
              <FormItem label="唯一键">
                {getFieldDecorator('key', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input unique key!',
                    },
                    { validator: validatorUniqueKey },
                  ],
                  initialValue: currentData.uniqeKey,
                })(<Input />)}
              </FormItem>
              <FormItem label="角色名称">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input role name!',
                    },
                  ],
                  initialValue: currentData.name,
                })(<Input />)}
              </FormItem>
              <FormItem label="状态">
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: '请选择状态！' }],
                  initialValue: currentData.status,
                })(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="0">在用</Option>
                    <Option value="1">停用</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="备注说明">
                {getFieldDecorator('note', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input note message!',
                    },
                  ],
                  initialValue: currentData.note,
                })(<Input />)}
              </FormItem>
              <FormItem label="拥有权限">
                <TreeSelect {...tProps} />
              </FormItem>
              <FormItem style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                <Popconfirm title="是否要删除此角色？" onConfirm={() => this.deleteRole()}>
                  <Button type="light" style={{marginLeft: 15}}>
                    删除
                  </Button>
                </Popconfirm>
              </FormItem>
            </Form>
          </Col>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default RoleManager;
