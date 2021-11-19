import 'antd/dist/antd.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { AdminRoute, NotFound, ScrollToTop, UserRoute } from 'components/Common';
import { AdminLayout } from 'components/Layouts';
import { authActions, selectIsLogged } from 'features/auth/authSlice';
import { CreatePost } from 'features/posts/components';
import { CreateReviewPage } from 'pages/CreateReviewPage';
import HomePage from 'pages/HomePage';
import MotelDetailPage from 'pages/MotelDetailPage';
import MotelPage from 'pages/MotelPage';
import PostPage from 'pages/PostPage';
import PostViewPage from 'pages/PostViewPage';
import { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Auth from "./features/auth";

const App = () => {
  const isLogged = useAppSelector(selectIsLogged)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLogged && Boolean(localStorage.getItem('accessToken'))) {
      dispatch(authActions.login({ username: '', password: '', rememberMe: true }))
    }
  }, [dispatch, isLogged])

  return (
    <>
      <ScrollToTop>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>

          <Route path="/motels/:id">
            <MotelDetailPage />
          </Route>

          <Route path="/motels">
            <MotelPage />
          </Route>

          <Route path='/posts/:id'>
            <PostViewPage />
          </Route>

          <Route path='/posts'>
            <PostPage />
          </Route>

          <UserRoute path='/create-post/review'>
            <CreateReviewPage />
          </UserRoute>

          <Route path="/auth">
            <Auth />
          </Route>

          <AdminRoute path="/admin">
            <AdminLayout />
          </AdminRoute>

          <Route>
            <NotFound />
          </Route>
        </Switch>
      </ScrollToTop>

      <CreatePost />
    </>
  );
}

export default App;
