import React, { useState } from "react";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaBuilding,
  FaSitemap,
  FaTicketAlt,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import logo from "../../utils/assets/Navbar/logo.png";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import ZTypography from "../../component/ZTypography/ztypography";
import { Labels } from "../../utils/constants/labels";
import { CommonColors } from "../../utils/constants/colors";
import "../../App.css";
import { labelRoutes } from "../../navigations/labelRoutes";
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import DescriptionIcon from '@mui/icons-material/Description';
import { CalendarHeart, Languages, Variable } from 'lucide-react';
import ZPopoverDialog from "../../component/ZDialogueBox/zdialog";
import { Avatar, Popover, IconButton, Typography, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { clearUserData } from "../../redux/action/UserDetail/userDetailAction";

function SidebarItem({ icon, text, onClick }) {
  return (
    <div className={Labels.classNames.sidebarItem} onClick={onClick}>
      {icon}
      <span className={Labels.classNames.sidebarItemText}>{text}</span>
    </div>
  );
}
export default function PageLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMasterHovered, setIsMasterHovered] = useState(false);
  const sidebarWidth = isSidebarOpen
    ? Labels.classNames.sidebarExpanded
    : Labels.classNames.sidebarCollapsed;
  const [anchorEl, setAnchorEl] = useState(null);
  const loginUser = useSelector((state) => state.userDetails.user);



  const user = {
    name: loginUser.UserName,
    avatar: "", //
    email: loginUser.Email
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "user-popover" : undefined;

  return (
    <div className={Labels.classNames.pageContainer}>
      {/* Navbar */}
      <div className={Labels.classNames.navbar}>
        <div className={Labels.classNames.navbarLeft}>
          <img
            src={logo}
            alt={Labels.logo}
            className={Labels.classNames.navbarLogo}
            style={{
              height: "37px",
              width: "37px",
              borderRadius: "10%",
            }}
          />
          <ZTypography
            labelText={Labels.zoiFintech}
            flag={Labels.subHeader}
            font={Labels.semiBold}
            color={CommonColors.darkGrey}
          />
        </div>

        {/* Right side user menu */}
        <div className="navbar-right" style={{ display: "flex", alignItems: "center ", }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",

              cursor: "pointer",
            }}
            onClick={handleClick}
          >
            <div style={{ display: "flex", flexDirection: "column", marginRight: "10px" }}>
              <span style={{ fontSize: "1rem", fontWeight: 600, color: "#111827" }}>
                Welcome {user.name}
              </span>
            </div>
            <Avatar
              alt={user.name}
              src={user.avatar || ""}
              sx={{ bgcolor: "#ffffff", color: "#80D8FF", mr: 1.5 }}
            >
              {!user.avatar && user.name ? user.name.charAt(0).toUpperCase() : ""}
            </Avatar>
          </div>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              style: {
                marginTop: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                borderRadius: "8px",
              },
            }}
          >
            <div style={{ padding: "12px 16px", minWidth: 200 }}>
              <ZTypography flag={Labels.smallText} labelText={user.email} />

              <Divider sx={{ my: 1 }} />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "#80D8FF",
                  padding: "4px 0",
                }}
                onClick={() => {
                  handleClose();
                  navigate(labelRoutes.home,{replace:true});
                  setTimeout(() => dispatch(clearUserData()), 1000);
                }}
              >
                <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
                Logout
              </div>
            </div>
          </Popover>
        </div>
      </div>
      {/* </div> */}
      {/* Sidebar */}
      <div
        className={`${Labels.classNames.sidebar} ${sidebarWidth}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => {
          setIsSidebarOpen(false);
          setIsMasterHovered(false);
        }}
      >
        <div className={Labels.classNames.sidebarBg} />
        <div className={Labels.classNames.sidebarContent}>
          <div className={Labels.classNames.sidebarLink}
            onClick={() => navigate(labelRoutes.userDashboard)}
            style={{ cursor: "pointer" }} >

            <FaHome size={20}
              onClick={() => navigate(labelRoutes.userDashboard)} />
            {isSidebarOpen && (
              <span className={Labels.classNames.sidebarLinkText}>
                {Labels.dashboard}

              </span>
            )}
          </div>
          <div
            onMouseEnter={() => setIsMasterHovered(true)}
            onMouseLeave={() => setIsMasterHovered(false)}
          >
            {(loginUser.IsAdmin || loginUser.IsAgent) &&
              <div className={Labels.classNames.sidebarLink}>
                <FaUser size={20} />
                {isSidebarOpen && (
                  <span className={Labels.classNames.sidebarLinkText}>
                    {Labels.master}
                  </span>
                )}
              </div>
            }

            {isSidebarOpen && isMasterHovered && (
              <div className={Labels.classNames.sidebarSubmenu}>
                <SidebarItem
                  icon={<FaBuilding size={18} />}
                  text={Labels.organisation}
                  onClick={() => navigate(labelRoutes.organizationSummary)}
                />
                <SidebarItem
                  icon={<FaUsers size={18} />}
                  text={Labels.users}
                  onClick={() => navigate(labelRoutes.userSummary)}
                />
                <SidebarItem
                  icon={<FaSitemap size={18} />}
                  text={Labels.department}
                  onClick={() => navigate(labelRoutes.departmentSummary)}
                />
                <SidebarItem
                  icon={<FaHome size={18} />}
                  text={Labels.serviceQueue}
                  onClick={() => navigate(labelRoutes.serviceQueue)}
                />
                <SidebarItem
                  icon={<FaUser size={18} />}
                  text={Labels.assignMethod}
                  onClick={() => navigate(labelRoutes.assignMethod)}
                />

                <SidebarItem
                  icon={<Languages size={18} />}
                  text={Labels.language}
                  onClick={() => navigate(labelRoutes.language)}
                />
                <SidebarItem
                  icon={<CalendarHeart size={18} />}
                  text={Labels.holiday}
                  onClick={() => navigate(labelRoutes.holiday)}
                />
                <SidebarItem
                  icon={<WatchLaterIcon sx={{ fontSize: 18 }} />}
                  text={Labels.businessHours}
                  onClick={() => navigate(labelRoutes.busHrsSummary)}
                />
                <SidebarItem
                  icon={<Variable size={18} />}
                  text={Labels.templateVariable}
                  onClick={() => navigate(labelRoutes.templateVariablesSummary)}
                />
                <SidebarItem
                  icon={<DescriptionIcon sx={{ fontSize: 18 }} />}
                  text={Labels.templateGroup}
                  onClick={() => navigate(labelRoutes.templateGroup)}
                />
                {/* <SidebarItem
                  icon={<FaTicketAlt size={18} />}
                  text={Labels.ticketDashboard}
                  onClick={() => navigate(labelRoutes.ticketDashboard)}
                /> */}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className={Labels.classNames.mainContent}>
        <div className={Labels.classNames.mainInner}>
          <Outlet />
        </div>
      </div>
      {/* Footer */}
      <div className={Labels.classNames.footer}>
        <ZTypography
          labelText={Labels.zoiFintechFooter}
          flag={Labels.smallText}
          font={Labels.bold}
          color={CommonColors.primary}
        />
      </div>
    </div>
  );
}

