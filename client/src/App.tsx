import 'antd/dist/antd.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { AdminRoute, NotFound, ScrollToTop, UserRoute } from 'components/Common';
import { AdminLayout } from 'components/Layouts';
import { authActions, selectIsLogged } from 'features/auth/authSlice';
import { notifyActions, selectFilterNotify } from 'features/notification/notifySlice';
import { CreatePost } from 'features/posts/components';
import { CreateReviewPage } from 'pages/CreateReviewPage';
import HomePage from 'pages/HomePage';
import MotelDetailPage from 'pages/MotelDetailPage';
import MotelPage from 'pages/MotelPage';
import NotificationPage from 'pages/NotificationPage';
import PostPage from 'pages/PostPage';
import PostViewPage from 'pages/PostViewPage';
import { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Auth from "./features/auth";

const App = () => {
  const isLogged = useAppSelector(selectIsLogged)
  const dispatch = useAppDispatch()
  const notifyFilter = useAppSelector(selectFilterNotify)

  useEffect(() => {
    if (!isLogged && Boolean(localStorage.getItem('accessToken'))) {
      dispatch(authActions.login({ username: '', password: '', rememberMe: true, isAutoLogin: true }))
    }
  }, [dispatch, isLogged])

  useEffect(() => {
    dispatch(notifyActions.get(notifyFilter))
  }, [dispatch, notifyFilter])

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

          <UserRoute path='/notifications'>
            <NotificationPage />
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
