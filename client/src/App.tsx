import 'antd/dist/antd.css';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { AdminRoute, ScrollToTop, UserRoute } from 'components/Common';
import { authActions, selectIsLogged } from 'features/auth/authSlice';
import { CreatePost } from 'features/posts/components';
import AddMotelPage from 'pages/AddMotelPage';
import { lazy, Suspense, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'react-image-gallery/styles/css/image-gallery.css'
import { selectStatusLoading } from 'features/loading/showLoadingSlice';
import GlobalLoading from 'features/loading/components/GlobalLoading';

const HomePage = lazy(() => import('pages/HomePage'))
const MotelDetailPage = lazy(() => import('pages/MotelDetailPage'))
const MotelPage = lazy(() => import('pages/MotelPage'))
const PostViewPage = lazy(() => import('pages/PostViewPage'))
const PostPage = lazy(() => import('pages/PostPage'))
const CreateReviewPage = lazy(() => import('pages/CreateReviewPage'))
const NotificationPage = lazy(() => import('pages/NotificationPage'))
const PersonalPage = lazy(() => import('pages/PersonalPage'))
const ChatPage = lazy(() => import('pages/ChatPage'))
const Auth = lazy(() => import('features/auth'))
const AdminPage = lazy(() => import('pages/AdminPage'))
const NotFound = lazy(() => import('components/Common'))

const App = () => {
  const isLogged = useAppSelector(selectIsLogged)
  const dispatch = useAppDispatch()
  const statusLoading = useAppSelector(selectStatusLoading)

  useEffect(() => {
    if (!isLogged && Boolean(localStorage.getItem('accessToken'))) {
      dispatch(authActions.login({ rememberMe: true, isAutoLogin: true }))
    }
  }, [dispatch, isLogged])

  return (
    <>
      <ScrollToTop>
        <Suspense fallback={<GlobalLoading />}>
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

            <UserRoute path="/add-motel">
              <AddMotelPage />
            </UserRoute>

            <Route path='/posts/:id'>
              <PostViewPage />
            </Route>

            <Route path='/posts'>
              <PostPage />
            </Route>

            <Route path='/profile/:id'>
              <PersonalPage />
            </Route>

            <UserRoute path='/create-post/review'>
              <CreateReviewPage />
            </UserRoute>

            <UserRoute path='/notifications'>
              <NotificationPage />
            </UserRoute>

            <UserRoute path='/chats/:groupId'>
              <ChatPage />
            </UserRoute>

            <UserRoute path='/chats'>
              <ChatPage />
            </UserRoute>

            <Route path="/auth">
              <Auth />
            </Route>

            <AdminRoute path="/admin">
              <AdminPage />
            </AdminRoute>

            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Suspense>
      </ScrollToTop>

      <CreatePost />

      {statusLoading && <GlobalLoading />}
    </>
  );
}

export default App;
