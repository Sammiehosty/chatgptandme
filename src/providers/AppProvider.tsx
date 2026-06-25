import React from 'react';
import {PlayerProvider} from '../PlayerContext';
export default function AppProvider({children}:{children:React.ReactNode}){return <PlayerProvider>{children}</PlayerProvider>}
