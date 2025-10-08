/* Dashboard */
import { Dashboard3 } from '../pages/dms/Dashboard/Dashboard3';
/* Users */
import { UserList } from '../pages/dms/App/UserManagement/Users/UserList';
import { UserAdd } from '../pages/dms/App/UserManagement/Users/UserAdd';
import { UserEdit } from '../pages/dms/App/UserManagement/Users/UserEdit';
import { UserProfile } from '../pages/dms/App/UserManagement/Users/UserProfile'
/* Employee */
import { EmployeeList } from '../pages/dms/Company/EmployeeManagement/EmployeeList'
import { EmployeeAdd } from '../pages/dms/Company/EmployeeManagement/EmployeeAdd'
import { EmployeeEdit } from '../pages/dms/Company/EmployeeManagement/EmployeeEdit'
import { EmployeeView } from '../pages/dms/Company/EmployeeManagement/EmployeeView'
/* Department */
import { DepartmentList } from '../pages/dms/Company/Department/DepartmentList'
import { DepartmentAdd } from '../pages/dms/Company/Department/DepartmentAdd'
import { DepartmentEdit } from '../pages/dms/Company/Department/DepartmentEdit'
/* Designation */
import { DesignationList } from '../pages/dms/Company/Designation/DesignationList'
import { DesignationAdd } from '../pages/dms/Company/Designation/DesignationAdd'
import { DesignationEdit } from '../pages/dms/Company/Designation/DesignationEdit'
/* Menu */
import { Menu } from '../pages/dms/Company/Menu/Menu'
import { MenuAdd } from '../pages/dms/Company/Menu/MenuAdd'
import { MenuEdit } from '../pages/dms/Company/Menu/MenuEdit'
/* Company Module */
import { CompanyModuleList } from '../pages/dms/Company/CompanyModule/CompanyModuleList';
import { CompanyModuleAdd } from '../pages/dms/Company/CompanyModule/CompanyModuleAdd';
import { CompanyModuleEdit } from '../pages/dms/Company/CompanyModule/CompanyModuleEdit';
/* Role */
import { EmployeeRole } from '../pages/dms/Company/EmployeeRole/EmployeeRole'
import { EmployeeRoleAdd } from '../pages/dms/Company/EmployeeRole/EmployeeRoleAdd'
import { EmployeeRoleEdit } from '../pages/dms/Company/EmployeeRole/EmployeeRoleEdit'
import { EmployeeRoleView } from '../pages/dms/Company/EmployeeRole/EmployeeRoleView'
/* Permission */
import { EmployeePermission } from '../pages/dms/Company/EmployeePermission/EmployeePermission'
import { EmployeePermissionAdd } from '../pages/dms/Company/EmployeePermission/EmployeePermissionAdd'
import { EmployeePermissionEdit } from '../pages/dms/Company/EmployeePermission/EmployeePermissionEdit'
import { EmployeePermissionView } from '../pages/dms/Company/EmployeePermission/EmployeePermissionView';
/* Activity logs */
/* import { ActivityList } from '../pages/dms/Company/ActivityLogs/ActivityList'
import { ActivityView } from '../pages/dms/Company/ActivityLogs/ActivityView' */
/* Riders */
import { RidersList } from '../pages/dms/App/Rider Management/RidersList'
import { RiderProfile } from '../pages/dms/App/Rider Management/RiderProfile'
/* Driver */
import { AllDrivers } from '../pages/dms/App/Driver Management/Drivers/AllDrivers'
import { DriversEdit } from '../pages/dms/App/Driver Management/DriversEdit'
import { DriversDetailsView } from '../pages/dms/App/Driver Management/DriversDetailsView'
/* Trip */
import { TripList } from '../pages/dms/App/TripsPPage/TripList'
import { TripEdit } from '../pages/dms/App/TripsPPage/TripEdit'
import { TripDetails } from '../pages/dms/App/TripsPPage/TripDetails'
/* Brand */
import { BrandList } from '../pages/dms/App/Vehicle Management/Brand/BrandList';
import { BrandAdd } from '../pages/dms/App/Vehicle Management/Brand/BrandAdd';
import { BrandEdit } from '../pages/dms/App/Vehicle Management/Brand/BrandEdit';
/* Model */
import { ModelList } from '../pages/dms/App/Vehicle Management/Model/ModelList'
import { ModelAdd } from '../pages/dms/App/Vehicle Management/Model/ModelAdd'
import { ModelEdit } from '../pages/dms/App/Vehicle Management/Model/ModelEdit'
/* Feedback and Ratings */
import { FeedbackToRider } from '../pages/dms/App/Driver Management/FeedbackToRider'
import { FeedbackToDriverList } from '../pages/dms/App/Rider Management/FeedbackToDriverList'
/* Payment and Transaction */
import {RidePaymentList} from '../pages/dms/App/PaymentPage/RidePayments/RidePaymentList'
import {RidePaymentAdd} from '../pages/dms/App/PaymentPage/RidePayments/RidePaymentAdd'
import {RidePaymentEdit} from '../pages/dms/App/PaymentPage/RidePayments/RidePaymentEdit'
import {RidePaymentDetails} from '../pages/dms/App/PaymentPage/RidePayments/RidePaymentDetails'
import { PendingPayouts } from '../pages/dms/App/PaymentPage/PendingPayouts/PendingPayouts';
import { PendingPayoutAdd } from '../pages/dms/App/PaymentPage/PendingPayouts/PendingPayoutAdd';
import { PendingPayoutEdit } from '../pages/dms/App/PaymentPage/PendingPayouts/PendingPayoutEdit';
import { DriverPayoutsList } from '../pages/dms/App/PaymentPage/DriverPayouts/DriverPayoutsList';
import { DriverPayoutAdd } from '../pages/dms/App/PaymentPage/DriverPayouts/DriverPayoutAdd';
import { DriverPayoutEdit } from '../pages/dms/App/PaymentPage/DriverPayouts/DriverPayoutEdit';
import { RefundRequestList } from '../pages/dms/App/PaymentPage/RefundRequest/RefundRequestList';
import { RefundRequestAdd } from '../pages/dms/App/PaymentPage/RefundRequest/RefundRequestAdd';
import { RefundRequestEdit } from '../pages/dms/App/PaymentPage/RefundRequest/RefundRequestEdit';
import { CommissionFeeList } from '../pages/dms/App/PaymentPage/CommissionFee/CommissionFeeList';
import { CommissionFeeAdd } from '../pages/dms/App/PaymentPage/CommissionFee/CommissionFeeAdd';
import { CommissionFeeEdit } from '../pages/dms/App/PaymentPage/CommissionFee/CommissionFeeEdit';
/* Settings */
import {RideFareSetting} from '../pages/dms/App/FareManagement/RideFareSetting/RideFareSetting'
import { FareSettingAdd } from '../pages/dms/App/FareManagement/RideFareSetting/FareSettingAdd';
import { FareSettingEdit } from '../pages/dms/App/FareManagement/RideFareSetting/FareSettingEdit';
/* Ride Type */
import { RideTypeList } from '../pages/dms/App/TripsPPage/RideTypes/RideTypeList';
import { RideTypeAdd } from '../pages/dms/App/TripsPPage/RideTypes/RideTypeAdd';
import { RideTypeEdit } from '../pages/dms/App/TripsPPage/RideTypes/RideTypeEdit';
/* Icon */
import { FaChartLine, } from "react-icons/fa";
import { FareDynamicRuleList } from '../pages/dms/App/FareManagement/FareDynamicRules/FareDynamicRuleList';
import { FareDynamicRuleAdd } from '../pages/dms/App/FareManagement/FareDynamicRules/FareDynamicRuleAdd';
import { FareDynamicRuleEdit } from '../pages/dms/App/FareManagement/FareDynamicRules/FareDynamicRuleEdit';
import { FareRegionList } from '../pages/dms/App/FareManagement/FareRegionSetting/FareRegionList';
import { FareRegionAdd } from '../pages/dms/App/FareManagement/FareRegionSetting/FareRegionAdd';
import { FareRegionEdit } from '../pages/dms/App/FareManagement/FareRegionSetting/FareRegionEdit';
import { FareSlabList } from '../pages/dms/App/FareManagement/FareSlabs/FareSlabList';
import { FareSlabAdd } from '../pages/dms/App/FareManagement/FareSlabs/FareSlabAdd';
import { FareSlabEdit } from '../pages/dms/App/FareManagement/FareSlabs/FareSlabEdit';
import { FareNightRulesList } from '../pages/dms/App/FareManagement/FareNightRules/FareNightRulesList';
import { FareNightRulesAdd } from '../pages/dms/App/FareManagement/FareNightRules/FareNightRulesAdd';
import { FareNightRulesEdit } from '../pages/dms/App/FareManagement/FareNightRules/FareNightRulesEdit';
import { RideFeedback } from '../pages/dms/App/RatingsAndFeedback/RideFeedback/RideFeedback';
import { UserRatingSummery } from '../pages/dms/App/RatingsAndFeedback/UserRatingSummary/UserRatingSummery';
import { DriverPerformanceMetrics } from '../pages/dms/App/RatingsAndFeedback/DriverPerformanceMetrics/DriverPerformanceMetrics';
import { ComplaintLogs } from '../pages/dms/App/RatingsAndFeedback/ComplaintLogs/ComplaintLogs';
import { RideFeedbackView } from '../pages/dms/App/RatingsAndFeedback/RideFeedback/RideFeedbackView';
import { CompalintLogsView } from '../pages/dms/App/RatingsAndFeedback/ComplaintLogs/CompalintLogsView';

export const moduleComponentMap = {
  dashboard: {
    icon: FaChartLine,
    view: Dashboard3,
  },
  employee: {
    view: EmployeeList,
    add: EmployeeAdd,
    edit: EmployeeEdit,
    viewDetails: EmployeeView,
  },
  department: {
    view: DepartmentList,
    add: DepartmentAdd,
    edit: DepartmentEdit,
  },
  designation: {
    view: DesignationList,
    add: DesignationAdd,
    edit: DesignationEdit,
  },
  menu: {
    view: Menu,
    add: MenuAdd,
    edit: MenuEdit,
  },
  module: {
    view: CompanyModuleList,
    add: CompanyModuleAdd,
    edit: CompanyModuleEdit,
  },
  role: {
    view: EmployeeRole,
    add: EmployeeRoleAdd,
    edit: EmployeeRoleEdit,
    viewDetails: EmployeeRoleView,
  },
  permission: {
    view: EmployeePermission,
    add: EmployeePermissionAdd,
    edit: EmployeePermissionEdit,
    viewDetails: EmployeePermissionView,
  },
 /*  activity: {
    view: ActivityList,
    viewDetails: ActivityView,
  }, */
  user: {
    view: UserList,
    add: UserAdd,
    edit: UserEdit,
    viewDetails: UserProfile,
  },
  rider: {
    view: RidersList,
    viewDetails: RiderProfile,
  },
  driver: {
    view: AllDrivers,
    edit: DriversEdit,
    viewDetails: DriversDetailsView,
  },
  trip: {
    view: TripList,
    edit: TripEdit,
    viewDetails: TripDetails
  },
  ridetypes:{
   view: RideTypeList,
   add: RideTypeAdd,
   edit: RideTypeEdit
  },
  brand: {
    view: BrandList,
    add: BrandAdd,
    edit: BrandEdit
  },
  model: {
    view: ModelList,
    add: ModelAdd,
    edit: ModelEdit,
  },
  feedbacktodriver: {
    view: FeedbackToDriverList,
  },
  feedbacktorider: {
    view: FeedbackToRider,
  },
  trippayment:{
  view: RidePaymentList,
  add: RidePaymentAdd,
  edit: RidePaymentEdit,
  viewDetails: RidePaymentDetails
  },
  pendingpayments:{
    view: PendingPayouts,
    add: PendingPayoutAdd,
    edit: PendingPayoutEdit
  },
  driverpayout:{
    view: DriverPayoutsList,
    add: DriverPayoutAdd,
    edit: DriverPayoutEdit
  },
  refundrequest:{
    view: RefundRequestList,
    add: RefundRequestAdd,
    edit: RefundRequestEdit
  },
  commissionfee:{
    view: CommissionFeeList,
    add: CommissionFeeAdd,
    edit: CommissionFeeEdit
  },
  faresettings: {
    view: RideFareSetting,
    add: FareSettingAdd,
    edit: FareSettingEdit
  },
  faredynamicrules:{
   view: FareDynamicRuleList,
   add: FareDynamicRuleAdd,
   edit: FareDynamicRuleEdit,
  },
  fareregion:{
    view: FareRegionList,
    add: FareRegionAdd,
    edit: FareRegionEdit,
  },
  fareslab:{
   view: FareSlabList,
   add: FareSlabAdd,
   edit: FareSlabEdit
  },
  farenightrules:{
   view: FareNightRulesList,
   add: FareNightRulesAdd,
   edit: FareNightRulesEdit,
  },
  ridefeedback:{
    view: RideFeedback,
    viewDetails: RideFeedbackView,
  },
  userratingsummary:{
    view: UserRatingSummery,
  },
  driverperformancemetrics:{
    view: DriverPerformanceMetrics,
  },
  complaintlogs:{
    view: ComplaintLogs,
    viewDetails: CompalintLogsView,
  }
};
