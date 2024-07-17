const BASE_URL = "http://203.115.11.236:10155/SalesTrackAppAPI/api/v1";


const ENDPOINTS = {
  AUTHENTICATE: "/Account/Authanticate",
  PROFILE_DETAILS: "/Account/GetAgentProfile",
  MDRT_PROFILE: "/Mdrt/GetPersonalMDRT",
  ISLANDRANK: "/Mdrt/GetIslandRankMDRT",
  BRANCHRANK: "/Mdrt/GetBranchRankMDRT",
  TEAMRANK: "/Mdrt/GetRegionalRankMDRT",
  TOTRANK: "/Mdrt/GetTOTRankMDRT",
  COTRANK: "/Mdrt/GetCOTRankMDRT",
  PERSONAL_MDRT: "/Mdrt/GetPersonalMDRT",
  LIFE_MEMBER_MDRT: "/Mdrt/GetLifeMemberMDRT",
  POLICY_COUNT: "/PolicyDetail/GetInforceLapsCount",
  POLICY_DETAILS:"/PolicyDetail/GetPolicyDetails",
};

export { BASE_URL, ENDPOINTS };
