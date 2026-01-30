import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import PageLayout from "../container/layout/pageLayout";
import { labelRoutes } from "./labelRoutes";
import Language from "../container/language/language";
import TemplatevariablesSummary from "../container/templateVariables/templatevariablesSummary";
import UserDashboard from "../container/userDashboard/userDashboard";
import TicketForm from "../container/ticketForm/ticketForm";

import { useSelector } from "react-redux";
import SessionExpired from "../container/sessionExpired/sessionExpired";
import Testing from "../../server/testing";
import Chatbox from "../container/chatBox/chatBox";

// Lazy load route components
const AssignMethod = lazy(() => import("../container/AssignMethod/assignMethod"));
const BusHrsBox = lazy(() => import("../container/buisnessHours/busHrsBox"));
const BusHrsForm = lazy(() => import("../container/buisnessHours/busHrsForm"));
const BusHrsSummary = lazy(() => import("../container/buisnessHours/busHrsSummary"));
const Department = lazy(() => import("../container/department/departmentForm"));
const DepartmentSummary = lazy(() => import("../container/department/departmentSummary"));
const Holiday = lazy(() => import("../container/holiday/holiday"));
const LoginPage = lazy(() => import("../container/login/loginPage"));
const Organisation = lazy(() => import("../container/organisation/organisation"));
const OrganisationSummary = lazy(() => import("../container/organisation/organisationSummary"));
const ServiceQueue = lazy(() => import("../container/serviceQueue/serviceQueue"));
const TemplateGroup = lazy(() => import("../container/templateGroup/templateGroup"));
const TemplateGroupAdd = lazy(() => import("../container/templateGroup/templateGroupAdd"));
const TicketDashboard = lazy(() => import("../container/ticketDashboard/ticketDashboard"));
const UserForm = lazy(() => import("../container/user/userForm"));
const UserSummary = lazy(() => import("../container/user/userSummary"));
const TicketPreview = lazy(() => import("../container/ticketPreview/ticketPreview"));
const TicketReply = lazy(() => import("../container/ticketReply/ticketReply"));

const UserRoute = () => {
  const verifiedUser = useSelector((state) => state.userDetails.user);
  return verifiedUser?.UserName ? <Outlet /> : <Navigate to={labelRoutes.home} replace />;
};
const AdminRoute = () => {
  const verifiedUser = useSelector((state) => state.userDetails.user);
  return verifiedUser?.IsAdmin || verifiedUser?.IsAgent
    ? <Outlet />
    : <Navigate to={labelRoutes.home} replace />;
};
const AdminLogin = () => {
  const verifiedUser = useSelector((state) => state.userDetails.user);
  const isAdmin = verifiedUser?.IsAdmin || verifiedUser?.IsAgent;
  return isAdmin ? <TicketDashboard /> : <UserDashboard />;
};
function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionExpired />
      <Routes>
        <Route path={labelRoutes.home} element={<LoginPage />} />
        <Route path={"/testing"} element={<Testing/>} />
         <Route path={"/ai"} element={<Chatbox />} />

        <Route element={<PageLayout />}>

          <Route element={<UserRoute />}>
            <Route path={labelRoutes.userDashboard} element={<AdminLogin />} />
            <Route path={labelRoutes.ticketForm} element={<TicketForm />} />
            <Route path={labelRoutes.ticketView} element={<TicketPreview />} />
            <Route path={labelRoutes.ticketReply} element={<TicketReply />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path={labelRoutes.userSummary} element={<UserSummary />} />
            <Route path={labelRoutes.userForm} element={<UserForm />} />
            <Route path={labelRoutes.organization} element={<Organisation />} />
            <Route path={labelRoutes.organizationSummary} element={<OrganisationSummary />} />
            <Route path={labelRoutes.departmentSummary} element={<DepartmentSummary />} />
            <Route path={labelRoutes.department} element={<Department />} />
            <Route path={labelRoutes.serviceQueue} element={<ServiceQueue />} />
            <Route path={labelRoutes.assignMethod} element={<AssignMethod />} />
            <Route path={labelRoutes.holiday} element={<Holiday />} />
            <Route path={labelRoutes.busHrsSummary} element={<BusHrsSummary />} />
            <Route path={labelRoutes.busHrsForm} element={<BusHrsForm />} />
            <Route path={labelRoutes.busHrsBox} element={<BusHrsBox />} />
            <Route path={labelRoutes.templateGroup} element={<TemplateGroup />} />
            <Route path={labelRoutes.templateGroupAdd} element={<TemplateGroupAdd />} />
            <Route path={labelRoutes.language} element={<Language />} />
            <Route path={labelRoutes.templateVariablesSummary} element={<TemplatevariablesSummary />} />
            <Route path={labelRoutes.ticketView} element={<TicketPreview />} />
            {/* <Route path={labelRoutes.ticketReply} element={<TicketReply />} /> */}
            <Route path={labelRoutes.ticketDashboard} element={<TicketDashboard />} />
            {/* <Route path={labelRoutes.ticketDashboard} element={<TicketDashboard />} /> */}
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
