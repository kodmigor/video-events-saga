import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppWrapper } from '../ui/app-wrapper'
import './index.scss'

const rootElement = document.getElementById('root')!
const ReactRoot = createRoot(rootElement)
ReactRoot.render(<AppWrapper />)
