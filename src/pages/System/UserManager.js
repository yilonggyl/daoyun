import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Row, Col, Card, Form, Input, Select, Button, Modal, message, Divider, Table } from 'antd';
import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

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
      title="新建用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入用户名！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
        {form.getFieldDecorator('status', {
          rules: [{ required: true, message: '请选择状态！' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            <Option value="0">在用</Option>
            <Option value="1">停用</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
        {form.getFieldDecorator('type', {
          rules: [{ required: true, message: '请选择角色！' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            <Option value="admin">admin</Option>
            <Option value="user">user</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('desc')(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ rule, loading, menu: menuModel }) => ({
  rule,
  loading: loading.models.rule,
  menuData: menuModel.menuData,
}))
@Form.create()
class UserManager extends PureComponent {
  state = {};

  constructor(props) {
    super(props);
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

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

  render() {
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href="#">{text}</a>,
        sorter: (a, b) => a.name.length - b.name.length,
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Status',
        filters: [
          {
            text: '在用',
            value: '0',
          },
          {
            text: '停用',
            value: '1',
          },
        ],
        dataIndex: 'status',
        key: 'status',
        onFilter: (value, record) => record.status === value,
        render: text => (text === '0' ? '在用' : '停用'),
      },
      {
        title: 'Type',
        key: 'type',
        dataIndex: 'type',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => {
          let x = '';
          if (record.type === '普通用户') x = <a href="#">设为会员</a>;
          else if (record.type === '会员') x = <a href="#">取消会员</a>;
          else x = <a href="#">{record.type}</a>;
          let y = '';
          if (record.status === '0') y = <a href="#">停用</a>;
          else if (record.status === '1') y = <a href="#">开始使用</a>;
          return (
            <span>
              <a href="#">删除</a>
              <Divider type="vertical" />
              <a href="#">重置密码</a>
              <Divider type="vertical" />
              {x}
              <Divider type="vertical" />
              {y}
            </span>
          );
        },
      },
    ];

    const data = [
      {
        key: '1',
        id: 1,
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        status: '0', // 在用 0 停用 1
        type: '管理员',
      },
      {
        key: '2',
        id: 2,
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        status: '0',
        type: '会员',
      },
      {
        key: '3',
        id: 3,
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        status: '1',
        type: '普通用户',
      },
      {
        key: '4',
        id: 4,
        name: 'Guo Yilong',
        age: 18,
        address: 'Quanzhou Fujian',
        status: '0',
        type: '普通用户',
      },
    ];
    const {
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const { modalVisible } = this.state;

    return (
      <PageHeaderWrapper title="用户管理">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Button
                style={{ marginBottom: 8 }}
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
                新建
              </Button>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={24}>
                    <FormItem label="用户id">
                      {getFieldDecorator('id')(<Input placeholder="请输入" />)}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem label="使用状态">
                      {getFieldDecorator('status')(
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                          <Option value="0">在用</Option>
                          <Option value="1">停用</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                        重置
                      </Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className={styles.tableListOperator}>
              <Table columns={columns} dataSource={data} loading={loading} />
            </div>
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default UserManager;
