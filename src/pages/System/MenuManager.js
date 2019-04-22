import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Form, Input, Select, Button, Modal, message, Divider, Table } from 'antd';
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
      title="添加菜单"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名字">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入名字！', min: 3 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="路径">
        {form.getFieldDecorator('path', {
          rules: [{ required: true, message: '请输入路径！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色权限">
        {form.getFieldDecorator('authority', {
          rules: [{ required: true, message: '请选择角色权限！' }],
        })(
          <Select mode="multiple" placeholder="请选择" style={{ width: '100%' }}>
            <Option value="admin">admin</Option>
            <Option value="user">user</Option>
          </Select>
        )}
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
class MenuManager extends PureComponent {
  state = {};

  constructor(props) {
    super(props);
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

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
      { title: 'Name', dataIndex: 'name', key: 'name', width: 20 },
      { title: 'Path', dataIndex: 'path', key: 'path', width: 50 },
      {
        title: 'Authority',
        dataIndex: 'authority',
        key: 'authority',
        width: 30,
        render: text => {
          if (text === undefined) return '';
          if (text.length === 2)
            return (
              <span>
                {text[0]}
                <Divider type="vertical" />
                {text[1]}
              </span>
            );
          return text;
        },
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => (
          <span>
            <a href="#">Edit</a>
            <Divider type="vertical" />
            <a href="#">Delete</a>
          </span>
        ),
        width: 30,
      },
    ];

    const { menuData } = this.props;
    console.log(menuData);
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const { modalVisible } = this.state;
    return (
      <PageHeaderWrapper title="菜单管理">
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
            </div>
            <div className={styles.tableListOperator}>
              <Table rowKey={record => record.name} columns={columns} dataSource={menuData} />
            </div>
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default MenuManager;
