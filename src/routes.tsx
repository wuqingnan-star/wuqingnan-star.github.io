import { RouteObject } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import WheelClickData from "./components/WheelClickData";
import FormsList from "./components/FormsList";
import FormRenderer from "./components/FormRenderer";
import SubmissionsTable from "./components/SubmissionsTable";
import HmcOptionsStats from "./components/hmcOptionsStats";
import HmcStepDwell from "./components/HmcStepDwell";
import HmcDropoffReport from "./components/HmcDropoffReport";
import HmcConversionStats from "./components/HmcConversionStats";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Dashboard chartType="dashboard" />,
  },
  {
    path: "/bar-chart",
    element: <Dashboard chartType="bar-chart" />,
  },
  {
    path: "/pie-chart",
    element: <Dashboard chartType="pie-chart" />,
  },
  {
    path: "/line-chart",
    element: <Dashboard chartType="line-chart" />,
  },
  {
    path: "/wheel-click-data",
    element: <WheelClickData />,
  },
  {
    path: "/hmc-options-stats",
    element: <HmcOptionsStats />,
  },
  {
    path: "/hmc-step-dwell",
    element: <HmcStepDwell />,
  },
  {
    path: "/hmc-dropoff-report",
    element: <HmcDropoffReport />,
  },
  {
    path: "/hmc-conversion-stats",
    element: <HmcConversionStats />,
  },
  {
    path: "/forms",
    element: <FormsList />,
  },
  {
    path: "/form/:formId",
    element: <FormRenderer />,
  },
  {
    path: "/admin/forms/:formId/submissions",
    element: <SubmissionsTable />,
  },
];
