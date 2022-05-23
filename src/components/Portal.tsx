import { ReactNode, useMemo } from 'react';

import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  selector?: string;
}

const Portal = ({ children, selector = '#portal' }: PortalProps) => {
  const portalSelector = useMemo(
    () => document.querySelector(selector) ?? null,
    [selector],
  );

  if (children && portalSelector) {
    return createPortal(children, portalSelector);
  }

  return null;
};

export default Portal;
