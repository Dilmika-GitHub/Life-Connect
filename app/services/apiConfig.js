const BASE_URL = "https://apisvc.sliclife.com/SalesTrackAppAPI/api/v1"; //live
//const BASE_URL = "http://122.255.4.187:10155/SalesTrackAppAPI/api/v1"; //test
//const BASE_URL_V2 = "https://apisvc.sliclife.com/SalesTrackAppAPI/api/v2"; //live v2
const BASE_URL_V2 = "http://122.255.4.187:10155/SalesTrackAppAPI/api/v2"; //test v2


const ENDPOINTS = {
  AUTHENTICATE: "/Account/Authanticate",
  GET_APP_VERSION: "/Admin/GetAppVersion",
  GET_APP_MAINTENANCE: "/Admin/GetAppMaintenance",
  CHECK_MAINTENANCE: "/Admin/GetAppMaintenance",
  PROFILE_DETAILS: "/Account/GetAgentProfile",
  CHANGE_PASSWORD: "/Account/ChangePassword",
  MDRT_PROFILE: "/Mdrt/GetPersonalMDRT",
  ISLANDRANK: "/Mdrt/GetIslandRankMDRT",
  MDRT_ACHIEVE_COUNT: "/Mdrt/GetMDRTAch",
  BRANCHRANK: "/Mdrt/GetBranchRankMDRT",
  TEAMRANK: "/Mdrt/GetRegionalRankMDRT",
  TOTRANK: "/Mdrt/GetTOTRankMDRT",
  COTRANK: "/Mdrt/GetCOTRankMDRT",
  PERSONAL_MDRT: "/Mdrt/GetPersonalMDRT",
  LIFE_MEMBER_MDRT: "/Mdrt/GetLifeMemberMDRT",
  POLICY_COUNT: "/PolicyDetail/GetInforceLapsCount",
  LAPSED_POLICY_DETAILS:"/PolicyDetail/GetPolicyDetails",
  MATURE_POLICY_DETAILS:"/Maturity/GetMaturityDetails",
  ACTUAL_KPI_VALUES: "/DashBoard/GetAgentKPIs",
  ACTUAL_INCOME_COMMISION_VALUE: "/DashBoard/GetAgentMonthlySalesIncome",
  SET_TARGET: "/DashBoard/SetTargets",
  GET_TARGET: "/DashBoard/GetSettedTarget",
  GET_IMAGE: "Image/GetProfileImage",
  GET_MONTHLY_PERSISTENCY: "/Persistancy/GetAgentMonthlyPersistancy",
  GET_PERSISTENCY_INFORCED: "/Persistancy/GetAgentPersInfoPol",
  GET_PERSISTENCY_LAPSED: "/Persistancy/GetAgentPersLapsPol",
  COMMISSION_STATEMEMNT: "/Commission/GetCommissionStatment",

  //Version 2 Endpoints
  ANNUAL_AWARDS_PROFILE: "/AnnualRewd/GetPersonalAnnualAward",
};

export { BASE_URL, BASE_URL_V2, ENDPOINTS };
