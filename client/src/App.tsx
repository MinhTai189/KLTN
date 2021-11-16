import 'antd/dist/antd.css';
import { AdminRoute, NotFound, ScrollToTop, UserRoute } from 'components/Common';
import { AdminLayout } from 'components/Layouts';
import { CreatePost } from 'features/communicate/components';
import { CreateReviewPage } from 'pages/CreateReviewPage';
import HomePage from 'pages/HomePage';
import MotelDetailPage from 'pages/MotelDetailPage';
import MotelPage from 'pages/MotelPage';
import PostPage from 'pages/PostPage';
import PostViewPage from 'pages/PostViewPage';
import { Route, Switch } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Auth from "./features/auth";

function App() {

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
