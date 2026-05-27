import { createBrowserRouter, Navigate } from 'react-router-dom'
import PrivateRoute from '@/components/layout/PrivateRoute'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import Fixture from '@/pages/Fixture'
import FixtureDetail from '@/pages/FixtureDetail'
import Ranking from '@/pages/Ranking'
import RankingUser from '@/pages/RankingUser'
import MisPredicciones from '@/pages/MisPredicciones'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <PrivateRoute />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: '/home', element: <Home /> },
      { path: '/fixture', element: <Fixture /> },
      { path: '/fixture/:id', element: <FixtureDetail /> },
      { path: '/ranking', element: <Ranking /> },
      { path: '/ranking/:usuario', element: <RankingUser /> },
      { path: '/mis-predicciones', element: <MisPredicciones /> },
    ],
  },
])
