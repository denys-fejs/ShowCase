import { createContext, ReactNode } from 'react';

export interface IBasicMainLayoutContext {
  setSubFooter?: (content: ReactNode | null) => void;
  setBackgroundImage?: (imageUrl: string) => void;
}

export default createContext<IBasicMainLayoutContext>({});
