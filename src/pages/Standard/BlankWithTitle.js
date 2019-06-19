import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Form } from 'antd';

@Form.create()
class BlankWithTitle extends PureComponent {
  render() {
    return (
      <PageHeaderWrapper title="这是主标题" content="这是副标题">
        <div>这里是内容</div>
      </PageHeaderWrapper>
    );
  }
}

export default BlankWithTitle;
