/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Card, Button, Icon, List, Popconfirm, message, Modal, Form, Input, Divider, Table, Dropdown, Menu,} from 'antd';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './CourseManage.less';
import DescriptionList from "../../components/DescriptionList/DescriptionList";
import Description from "../../components/DescriptionList/Description";

const FormItem = Form.Item;

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
      title='创建班课'
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="课程名称">
        {form.getFieldDecorator('coursename', {
          rules: [{ required: true }],
        })(<Input placeholder="请输入课程名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="任课老师">
        {form.getFieldDecorator('teachername', {
          rules: [{ required: true}],
        })(<Input placeholder="请输入任课老师" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="课程描述">
        {form.getFieldDecorator('intro', {
          rules: [{ required: true}],
        })(<Input placeholder="请输入课程描述" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ course, list, loading }) => ({
  course,
  list,
  loading: loading.models.list,
}))
class CourseManage extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      modalVisible: false,
      visible: false,
      currentItem: {},
      dataSource: [
        {
          key: '1',
          name: '胡彦斌',
          sno: '180327001',
          status: '已签到',
        },
        {
          key: '2',
          name: '胡彦祖',
          sno: '180327002',
          status: '缺勤',
        },
        {
          key: '3',
          name: '胡彦祖',
          sno: '180327003',
          status: '缺勤',
        },
        {
          key: '4',
          name: '胡彦祖',
          sno: '180327004',
          status: '缺勤',
        },
        {
          key: '5',
          name: '胡彦祖',
          sno: '180327005',
          status: '缺勤',
        },
        {
          key: '6',
          name: '胡彦祖',
          sno: '180327006',
          status: '缺勤',
        },
      ]
    };
    this.loadCourseList(props);
  }
  
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  
  handleVisible = flag => {
    this.setState({
      visible: !!flag,
    });
  };
  
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'course/insertCourse',
      payload: fields,
    });
    message.success('创建成功！');
    this.handleModalVisible();
    setTimeout(function () {
      window.location.reload();
    },500)
  };
  
  loadCourseList = props => {
    const { dispatch } = props;
    dispatch({
      type: 'course/queryCourseList',
      payload: {},
    });
  };
  
  remove = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'course/deleteCourse',
      payload: id,
    });
    message.success('删除成功');
    setTimeout(function () {
      window.location.reload();
    },500);
  };
  
  openModal = item => {
    this.handleVisible(true);
    this.setState({currentItem: item});
  };
  
  changeStatus = (key, current) => {
    this.setState({
      isLoading: true,
    });
    setTimeout(() => {
      const {dataSource} = this.state;
      dataSource.forEach((item) => {
        if(item.key == current.key) item.status = key;
        return item;
      });
      this.setState({dataSource});
      this.setState({
        isLoading: false,
      });
    },500);
  };
  
  render() {
    const {
      course: {list},
      loading,
    } = this.props;
    
    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          老师您好！
          
          以下为您创建的班课列表，点击详情可以查看班课信息并进行修改，点击删除可以删除班课。也可以创建一个新的班课。
        </p>
      </div>
    );
    
    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );
  
    const { modalVisible, visible, currentItem, dataSource, isLoading } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
  
    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => this.changeStatus(key, props.current)}>
            <Menu.Item key="已签到">已签到</Menu.Item>
            <Menu.Item key="缺勤">缺勤</Menu.Item>
            <Menu.Item key="事假">事假</Menu.Item>
            <Menu.Item key="病假">病假</Menu.Item>
          </Menu>
        }
      >
        <a>
          {props.current.status} <Icon type="down" />
        </a>
      </Dropdown>
    );
  
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '学号',
        dataIndex: 'sno',
        key: 'sno',
      },
      {
        title: '签到状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, row) => {
          return (
            <MoreBtn current={row} />
          )
        }
      },
    ];
    
    return (
      <PageHeaderWrapper title="班课列表" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card className={styles.card} actions={[<a onClick={() => this.openModal(item)}>详情</a>, <Popconfirm title="是否要删除此课程？" onConfirm={() => this.remove(item.id)}><a>删除</a></Popconfirm>]}>
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src="https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png" />}
                      title={<a>{item.coursename}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          任课老师：{item.teachername} <br /><br />{item.intro}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton} onClick={() => this.handleModalVisible(true)}>
                    <Icon type="plus" /> 创建班课
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <Modal
          destroyOnClose
          title='班课详细信息'
          width={1000}
          visible={visible}
          onOk={() => this.handleVisible()}
          onCancel={() => this.handleVisible()}
        >
          <DescriptionList size="large" title="班课详情" style={{ marginBottom: 32 }}>
            <Description term="班课名称">{currentItem.coursename}</Description>
            <Description term="任课老师">{currentItem.teachername}</Description>
            <Description term="已选学生">5/30</Description>
            <Description term="班课学分">3分</Description>
            <Description term="上课时间">{currentItem.time}</Description>
            <Description term="班课简介" column={3}>{currentItem.intro}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>学生签到详情</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={isLoading}
            dataSource={dataSource}
            columns={columns}
            rowKey='key'
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default CourseManage;
