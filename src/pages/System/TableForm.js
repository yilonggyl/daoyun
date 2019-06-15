import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Input, message, Popconfirm, Divider, Select } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './style.less';

const { Option } = Select;

@connect(({ user }) => ({
  user,
}))
class TableForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.unshift({
      key: `NEW_TEMP_ID_${this.index}`,
      name: '',
      email: '',
      role_id: 0,
      status: 0,
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  resetPassword = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/resetPassword',
      payload: id,
      callback: res => {
        if (res) {
          message.info('重置成功！'); // 请求完成后返回的结果
        }
      },
    });
  };

  handleChange = (value, fieldName, key) => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  };

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.name || !target.email) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { dispatch, onChange } = this.props;
      target.tags = '';
      target.geographic = '';
      if (target.isNew) {
        target.password = '123';
        target.roleId = target.role_id;
        dispatch({
          type: 'user/insertUser',
          payload: target,
          callback: res => {
            if (res) {
              data[0].id = res.id;
              onChange(data); // 请求完成后返回的结果
            }
          },
        });
      } else {
        target.roleId = target.role_id;
        dispatch({
          type: 'user/updateUser',
          payload: target,
        });
      }
      delete target.isNew;
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  remove(key, id) {
    const { data } = this.state;
    const { onChange, dispatch } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
    if (id !== undefined) {
      dispatch({
        type: 'user/deleteUser',
        payload: id,
      });
    }
  }

  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        sorter: (a, b) => a.name.length - b.name.length,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'name', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="姓名"
              />
            );
          }
          return <a href="#">{text}</a>;
        },
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'email', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="邮箱"
              />
            );
          }
          return text;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '20%',
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
        onFilter: (value, record) => record.status === value,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                placeholder="请选择"
                defaultValue={text === 0 || text === '0' ? '在用' : '停用'}
                onChange={value => {
                  this.handleChange(value, 'status', record.key);
                }}
              >
                <Option key={0} value="0">
                  在用
                </Option>
                <Option key={1} value="1">
                  停用
                </Option>
              </Select>
            );
          }
          return text === 0 || text === '0' ? '在用' : '停用';
        },
      },
      {
        title: '类型',
        dataIndex: 'role_id',
        key: 'role_id',
        width: '20%',
        render: (text, record) => {
          let typeText =  '';
          if (text === 0) typeText = '管理员';
          else if(text === 1) typeText = '老师';
          else typeText = '学生';
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                placeholder="请选择"
                defaultValue={typeText}
                onChange={value => {
                  this.handleChange(value, 'role_id', record.key);
                }}
              >
                <Option key={0} value={0}>
                  管理员
                </Option>
                <Option key={1} value={1}>
                  老师
                </Option>
                <Option key={1} value={1}>
                  学生
                </Option>
              </Select>
            );
          }
          return typeText;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          if (record.role_id === 0) {
            return (
              <span>
                <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm title="是否重置密码？" onConfirm={() => this.resetPassword(record.id)}>
                  <a>重置密码</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否重置密码？" onConfirm={() => this.resetPassword(record.id)}>
                <a>重置密码</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="是否要删除此行？"
                onConfirm={() => this.remove(record.key, record.id)}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const { loading, data } = this.state;

    return (
      <Fragment>
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增成员
        </Button>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
      </Fragment>
    );
  }
}

export default TableForm;
