'use client';

import React, { useState } from 'react';
import Modal1 from './Modal1';
import RichTextEditor from './RichTextModal';
import UserAccountSettings from './UserAccountSettings';
import AccountOverview from './AccountOverview';
import ChatInterface from './ChatUi';
import ContactUs from './ContactUs';
import Dashboard from './DashboardPage';
import MultiStepForm from './Multistepper';
import TrackOrder from './TrackOrder';
import StyledTab from './StyledTab';
import NewsletterComponent from './NewsLetterComponent';
import Pagination from './Pagination';
import PermissionSetting from './PermissionSettings';
import MultiSelectSkills, { MultiSelect } from './MultiSelect';
// import SaveReminderPanel from './SaveReminderPanel';
import AlertPopup from './AlertComponent';
import { LoaderInner, LoaderOuter } from './Loader';
import SingleProductPage, { SingleItemPage } from './SingleItemPage';
import TrustedBrandSlider from './FullwidthSlider';
import TestimonialCarousel, { TestimonialsCarousel } from './Testimonials';
import DataTable from './DataTable';
import OrderDetailsPage from './OrderDetails';
import PasswordResetComponent from './PasswordReset';
import LoginComponent from './LoginComponent';
// import AvatarDemo from '../components/avatar/Avatar';

const TestPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen gap-4 bg-gray-100">
      <Modal1 />
      <RichTextEditor />
      <UserAccountSettings />
      <AccountOverview />
      <ChatInterface />
      <ContactUs />
      <Dashboard />
      <MultiStepForm />
      <TrackOrder />
      <StyledTab />
      <NewsletterComponent />
      <Pagination />
      <PermissionSetting />
      <MultiSelectSkills />
      <MultiSelect />
      {/* <SaveReminderPanel /> */}
      <AlertPopup />
      <LoaderOuter />
      {/* <LoaderInner /> */}
      <SingleProductPage />
      <SingleItemPage />
      <TrustedBrandSlider />
      <TestimonialCarousel />
      <TestimonialsCarousel />
      <DataTable />
      <OrderDetailsPage />
      <PasswordResetComponent />
      <LoginComponent />
      {/* <AvatarDemo /> */}
    </div>
  );
};

export default TestPage;
