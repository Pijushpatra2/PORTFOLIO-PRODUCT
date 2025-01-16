import './App.css'
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProjectsView from './pages/ProjectsView'
import Footer from './pages/Footer'
import { ModeToggle } from './components/mode-toggle'
import { ToastContainer } from 'react-toastify'


const App = () => {

  return (
    <>
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <ModeToggle/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/project/:id' element={<ProjectsView/>}/>
          </Routes>
          <Footer/>
          <ToastContainer position='bottom-right' theme='dark'/>
        </Router>
     </ThemeProvider>
    </>
  )
}

export default App
