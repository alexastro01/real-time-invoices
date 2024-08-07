'use client'

import { ReactNode } from 'react';
//@ts-ignore
import { OCConnect, OCConnectProps } from '@opencampus/ocid-connect-js';

interface OCConnectWrapperProps {
  children: ReactNode;
  opts: OCConnectProps['opts'];
  sandboxMode?: boolean;
}

export default function OCConnectWrapper({ children, opts, sandboxMode }: OCConnectWrapperProps) {
  return (
    <OCConnect opts={opts} sandboxMode={sandboxMode}>
      {children}
    </OCConnect>
  );
}