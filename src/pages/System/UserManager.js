import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Form, Input, Select, Modal, message } from 'antd';
import styles from '../List/TableList.less';
import TableForm from './TableForm';
import { addKey } from '../../utils/utils';

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

@connect(({ user, rule, loading, menu: menuModel }) => ({
  user,
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
    this.loadUserList(props);
  }

  loadUserList = props => {
    const { dispatch } = props;
    dispatch({
      type: 'user/fetch',
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
    const {
      user,
      form: { getFieldDecorator },
    } = this.props;
    const newData = addKey(user.list);
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const { modalVisible } = this.state;

    return (
      <PageHeaderWrapper title="用户管理">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {getFieldDecorator('members', {
                initialValue: newData,
              })(<TableForm />)}
            </div>
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default UserManager;
