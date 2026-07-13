// navigation/AppNavigator.jsx
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ToastProvider } from "../components/ToastProvider";
import SidebarLayout from "../components/SidebarLayout";
import { useState, useEffect } from "react";
import { notificationAPI } from "../services/api";

// Public screens
import WelcomeScreen           from "../screens/WelcomeScreen";
import AboutScreen             from "../screens/AboutScreen";
import RegisterScreen          from "../screens/Auth/RegisterScreen";
import ApplicantRegisterScreen from "../screens/Auth/ApplicantRegisterScreen";
import LoginScreen             from "../screens/Auth/LoginScreen";

// Applicant screens
import ApplicantDashboard       from "../screens/Applicant/ApplicantDashboard";
import ProfileScreen            from "../screens/Applicant/ProfileScreen";
import MyApplicationsScreen     from "../screens/Applicant/MyApplicationsScreen";
import NotificationsScreen      from "../screens/Applicant/NotificationsScreen";
import ApplicationDetailsScreen from "../screens/Applicant/ApplicationDetailsScreen";

const AUTH_ROUTES = ['/', '/about', '/register', '/applicant-register', '/login'];

function AppShell() {
    const location = useLocation();
    const navigate = useNavigate();

    const isAuthRoute = AUTH_ROUTES.includes(location.pathname);

    const [user,        setUser]        = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const ud = localStorage.getItem('user');
        if (ud) {
            try { setUser(JSON.parse(ud)); } catch { /* ignore */ }
        }
    }, [location.pathname]);

    useEffect(() => {
        if (!isAuthRoute && user?.applicant_id) {
            notificationAPI.getUnreadCount(user.applicant_id, 'Applicant')
                .then(r => { if (r.data.success) setUnreadCount(r.data.unreadCount || 0); })
                .catch(() => {});
        }
    }, [user, location.pathname]);

    const routes = (
        <Routes>
            {/* ── Public ── */}
            <Route path="/"                  element={<WelcomeScreen />} />
            <Route path="/about"             element={<AboutScreen />} />
            <Route path="/register"          element={<RegisterScreen />} />
            <Route path="/applicant-register" element={<ApplicantRegisterScreen />} />
            <Route path="/login"             element={<LoginScreen />} />

            {/* ── Applicant (authenticated) ── */}
            <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
            <Route path="/complete-profile"  element={<ProfileScreen />} />
            <Route path="/my-applications"   element={<MyApplicationsScreen />} />
            <Route path="/notifications"     element={<NotificationsScreen />} />
            <Route path="/application-details/:applicationId" element={<ApplicationDetailsScreen />} />
        </Routes>
    );

    if (isAuthRoute) {
        return <div style={{ minHeight: '100vh' }}>{routes}</div>;
    }

    return (
        <SidebarLayout user={user} unreadCount={unreadCount}>
            {routes}
        </SidebarLayout>
    );
}

export default function AppNavigator() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <AppShell />
            </ToastProvider>
        </BrowserRouter>
    );
}
