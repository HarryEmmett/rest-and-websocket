import "./styles/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import UserProfile from "./pages/UserProfile/UserProfile";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./hooks/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./hooks/AuthProvider/AuthProvider";
import Post from "./pages/Post/Post";
import PostsScroll from "./pages/Posts/PostsScroll";

const App: React.FC = (): JSX.Element => {

    const router = createBrowserRouter([
        {
            path: "/register",
            element:
                <AuthProvider >
                    <Register />
                </AuthProvider>
        },
        {
            path: "/login",
            element:
                <AuthProvider >
                    <Login />
                </AuthProvider>
        },
        {
            path: "/*",
            element:
                <AuthProvider >
                    <ProtectedRoute>
                        <NotFound />
                    </ProtectedRoute>
                </AuthProvider >
        },
        {
            path: "/",
            element:
                <AuthProvider >
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                </AuthProvider>
        },
        {
            path: "/:user/profile",
            element:
                <AuthProvider >
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                </AuthProvider >
        },
        {
            path: "posts",
            element:
                <AuthProvider >
                    <ProtectedRoute>
                        <PostsScroll />
                    </ProtectedRoute>
                </AuthProvider >
        },
        {
            path: "/:postId/post",
            element:
                <AuthProvider >
                    <ProtectedRoute>
                        <Post />
                    </ProtectedRoute>
                </AuthProvider >
        }
    ]);

    return (
        <div id="app-container" className="app-container">
            <RouterProvider router={router} />
        </div>
    );
};

export default App;