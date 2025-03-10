import axios from './CustomizedAxios';

export interface QueryInput {
  from_date: string;
  to_date: string;
  package_name: string;
  country: string;
  source: string;
}

export interface QueryResult {
  d1: number;
  d3: number;
  d7: number;
  a1: number;
  b1: number;
  a2: number;
  b2: number;
  arpdau: number;
}

const QueryData = async (from_date: string, to_date: string, package_name: string, country: string = "", partner: string = "", campaign: string = ""): Promise<any> => {
  const data = JSON.stringify({
    from_date: from_date,
    to_date: to_date,
    package_name: package_name,
    country: country,
    source: partner,
    campaign_name: campaign
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/ltv/calculate',  
    data: data,
  };

  return axios(config);
};

const CalCoefficients = async (object: {}): Promise<any> => {
  const data = object

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/ltv/calculate/coefficients',  
    data: data,
  };

  return axios(config);
};

const QueryCampaign = async (from_date: string, to_date: string, package_name: string, country: string = "", partner: string = ""): Promise<any> => {
  const data = JSON.stringify({
    from_date: from_date,
    to_date: to_date,
    package_name: package_name,
    country: country,
    source: partner
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/ltv/query/campaign',  
    data: data,
  };

  return axios(config);
};

const QueryPermission = async (username: string, accessToken: string): Promise<any> => {
  const data = JSON.stringify({
    username: username,
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "/ltv/query/permission",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "accept": "application/json",
    },
    data: data,
  };

  return axios(config);
};


const QueryGames = async (view_all: boolean, games_list: string[]): Promise<any> => {
  const data = JSON.stringify({
    view_all: view_all,
    games_list: games_list
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/ltv/query/games',  
    data: data,
  };

  return axios(config);
};

export { QueryData, CalCoefficients, QueryCampaign, QueryPermission, QueryGames };