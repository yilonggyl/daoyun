import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Form, Input, Select, Button, Modal, message, Divider, Table } from 'antd';
import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, currentDataProps } = props;
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
      title={currentDataProps.title}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名字">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, min: 3 }],
          initialValue: currentDataProps.name
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="路径">
        {form.getFieldDecorator('path', {
          rules: [{ required: true}],
          initialValue: currentDataProps.path
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色权限">
        {form.getFieldDecorator('authority', {
          rules: [{ required: true }],
          initialValue: currentDataProps.authority
        })(
          <Select mode="multiple" placeholder="请选择" style={{ width: '100%' }}>
            <Option value="admin">admin</Option>
            <Option value="teacher">teacher</Option>
            <Option value="student">student</Option>
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

  constructor(props) {
    super(props);
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    this.state = {
      currentData: {
        title: '添加菜单'
      },
      dataList: props.menuData
    };
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const {currentData, dataList} = this.state;
    dispatch({
      type: 'rule/add',
      payload: {
        address: fields.address,
      },
    });
    if (currentData.title === '添加菜单') {
      message.success('添加成功！请在本地创建该文件，并在router.config.js中配置方能生效！');
      dataList.push(fields);
    } else {
      message.success('更新成功！');
    }
    this.handleModalVisible();
  };
  
  editMenu = (record) => {
    this.setState({currentData: {
      ...record,
      title: '编辑菜单'
    }});
    this.handleModalVisible(true);
  };
  
  addMenu = () => {
    this.setState({currentData: {
      title: '添加菜单',
      name: '',
      path: '',
      authority: []
    }});
    this.handleModalVisible(true);
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
          if (text.length === 3)
            return (
              <span>
                {text[0]}
                <Divider type="vertical" />
                {text[1]}
                <Divider type="vertical" />
                {text[2]}
              </span>
            );
          return text;
        },
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (record) => (
          <span>
            <a onClick={() => this.editMenu(record)}>Edit</a>
            <Divider type="vertical" />
            <a href="#">Delete</a>
          </span>
        ),
        width: 30,
      },
    ];
    
    const { modalVisible, currentData, dataList } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      currentDataProps: currentData
    };
    return (
      <PageHeaderWrapper title="菜单管理">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Button
                style={{ marginBottom: 8 }}
                icon="plus"
                type="primary"
                onClick={() => this.addMenu()}
              >
                新建
              </Button>
            </div>
            <div className={styles.tableListOperator}>
              <Table rowKey={record => record.name} columns={columns} dataSource={dataList} />
            </div>
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default MenuManager;
