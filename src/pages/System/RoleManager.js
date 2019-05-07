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
  TreeSelect,
} from 'antd';

const { SHOW_PARENT } = TreeSelect;
const FormItem = Form.Item;
const { Option } = Select;

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-1',
        key: '0-0-1',
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
  },
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

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class RoleManager extends React.Component {
  state = {
    selectValue: [],
  };

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
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const { modalVisible, selectValue } = this.state;
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
            <Row>
              <Card
                hoverable
                bordered={false}
                onClick={() => this.handleModalVisible(true)}
                style={{ textAlign: 'center' }}
              >
                <h2>管理员</h2>
                <span style={{ fontSize: 15 }}>拥有所有权限</span>
              </Card>
            </Row>
            <Divider />
            <Row>
              <Card
                hoverable
                bordered={false}
                onClick={() => this.handleModalVisible(true)}
                style={{ textAlign: 'center' }}
              >
                <h2>普通用户</h2>
                <span style={{ fontSize: 15 }}>只有部分权限</span>
              </Card>
            </Row>
            <Divider />
            <Row>
              <Card
                hoverable
                bordered={false}
                onClick={() => this.handleModalVisible(true)}
                style={{ textAlign: 'center' }}
              >
                <h2>新增角色</h2>
                <span style={{ fontSize: 15 }}>新增一个角色</span>
              </Card>
            </Row>
          </Col>
          <Col sm={20} xs={24} style={{ paddingLeft: 20 }}>
            <h3>角色：管理员</h3>
            <Form layout="vertical" onSubmit={this.handleSubmit}>
              <FormItem label="唯一键">
                {getFieldDecorator('key', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input unique key!',
                    },
                  ],
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
                })(<Input />)}
              </FormItem>
              <FormItem label="状态">
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: '请选择状态！' }],
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
                })(<Input />)}
              </FormItem>
              <FormItem label="拥有权限">
                <TreeSelect {...tProps} />
              </FormItem>
              <FormItem style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
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
