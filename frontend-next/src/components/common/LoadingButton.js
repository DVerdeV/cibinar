import { Button } from 'antd';
import React from 'react';

export default function LoadingButton({ loading, children, ...props }) {
  return (
    <Button loading={loading} {...props}>
      {children}
    </Button>
  );
}
