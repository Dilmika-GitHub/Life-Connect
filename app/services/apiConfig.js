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
  AGENT_PROFILE: "/Account/GetAgentProfile",
  PERSONAL_MDRT: "/Mdrt/GetPersonalMDRT"
};

export { BASE_URL, ENDPOINTS };
