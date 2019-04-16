import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Form } from 'antd';

@Form.create()
class BlankWithCard extends PureComponent {
  render() {
    return (
      <PageHeaderWrapper title="这是主标题" content="这是副标题">
        <Card title="卡片标题" extra={<a href="#">More</a>}>
          卡片内容
        </Card>
        <Card title="卡片标题" extra={<a href="#">More</a>} style={{ marginTop: 16 }}>
          卡片内容
        </Card>
        <Card title="卡片标题" extra={<a href="#">More</a>} style={{ marginTop: 16 }}>
          卡片内容
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BlankWithCard;
