import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import PrivateRoute from './PrivateRoute';

// Public Pages
import Home from '../pages/home/Home';
import ExploreCampaigns from '../pages/campaigns/ExploreCampaigns';
import CampaignDetails from '../pages/campaigns/CampaignDetails';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFound from '../pages/error/NotFound';

// Supporter Dashboard Pages
import SupporterHome from '../pages/dashboard/supporter/SupporterHome';
import MyContributions from '../pages/dashboard/supporter/MyContributions';
import PurchaseCredit from '../pages/dashboard/supporter/PurchaseCredit';
import SupporterPaymentHistory from '../pages/dashboard/supporter/PaymentHistory';

// Creator Dashboard Pages
import CreatorHome from '../pages/dashboard/creator/CreatorHome';
import AddNewCampaign from '../pages/dashboard/creator/AddNewCampaign';
import MyCampaigns from '../pages/dashboard/creator/MyCampaigns';
import Withdrawals from '../pages/dashboard/creator/Withdrawals';
import CreatorPaymentHistory from '../pages/dashboard/creator/CreatorPaymentHistory';

// Admin Dashboard Pages
import AdminHome from '../pages/dashboard/admin/AdminHome';
import CampaignApprovals from '../pages/dashboard/admin/CampaignApprovals';
import ManageUsers from '../pages/dashboard/admin/ManageUsers';
import ManageCampaigns from '../pages/dashboard/admin/ManageCampaigns';
import WithdrawalRequests from '../pages/dashboard/admin/WithdrawalRequests';
import Reports from '../pages/dashboard/admin/Reports';

export const router = createBrowserRouter([
  // 1. Basic Public Layout Routes
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/campaigns',
        element: <ExploreCampaigns />,
      },
      {
        path: '/campaigns/:id',
        element: <CampaignDetails />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '*',
        element: <NotFound />,
      }
    ],
  },

  // 2. Dashboard Layout Routes (Secured with PrivateRoute and Role Guards)
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Supporter Routes
      {
        path: 'supporter-home',
        element: (
          <PrivateRoute allowedRoles={['supporter', 'admin']}>
            <SupporterHome />
          </PrivateRoute>
        ),
      },
      {
        path: 'explore-campaigns',
        element: (
          <PrivateRoute allowedRoles={['supporter', 'admin']}>
            <ExploreCampaigns />
          </PrivateRoute>
        ),
      },
      {
        path: 'my-contributions',
        element: (
          <PrivateRoute allowedRoles={['supporter', 'admin']}>
            <MyContributions />
          </PrivateRoute>
        ),
      },
      {
        path: 'purchase-credit',
        element: (
          <PrivateRoute allowedRoles={['supporter', 'admin']}>
            <PurchaseCredit />
          </PrivateRoute>
        ),
      },
      {
        path: 'payment-history',
        element: (
          <PrivateRoute allowedRoles={['supporter', 'admin']}>
            <SupporterPaymentHistory />
          </PrivateRoute>
        ),
      },

      // Creator Routes
      {
        path: 'creator-home',
        element: (
          <PrivateRoute allowedRoles={['creator', 'admin']}>
            <CreatorHome />
          </PrivateRoute>
        ),
      },
      {
        path: 'add-campaign',
        element: (
          <PrivateRoute allowedRoles={['creator', 'admin']}>
            <AddNewCampaign />
          </PrivateRoute>
        ),
      },
      {
        path: 'my-campaigns',
        element: (
          <PrivateRoute allowedRoles={['creator', 'admin']}>
            <MyCampaigns />
          </PrivateRoute>
        ),
      },
      {
        path: 'withdrawals',
        element: (
          <PrivateRoute allowedRoles={['creator', 'admin']}>
            <Withdrawals />
          </PrivateRoute>
        ),
      },
      {
        path: 'creator-payments',
        element: (
          <PrivateRoute allowedRoles={['creator', 'admin']}>
            <CreatorPaymentHistory />
          </PrivateRoute>
        ),
      },

      // Admin Routes
      {
        path: 'admin-home',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <AdminHome />
          </PrivateRoute>
        ),
      },
      {
        path: 'campaign-approvals',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <CampaignApprovals />
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-users',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <ManageUsers />
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-campaigns',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <ManageCampaigns />
          </PrivateRoute>
        ),
      },
      {
        path: 'withdrawal-requests',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <WithdrawalRequests />
          </PrivateRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <PrivateRoute allowedRoles={['admin']}>
            <Reports />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
