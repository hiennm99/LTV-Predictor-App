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


const getCheatInfoOverview = async (from_date: string | undefined, to_date: string| undefined, group_by: string) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: '/cheatinfo/overview',
        params: { 
            'Content-Type': 'application/json',
            'from_date': from_date,
            'to_date': to_date,
            'group_by': group_by
        },
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return axios(config);
};

const getCheatInfoDetails = async (from_date: string | undefined, to_date: string | undefined, country: string, partner: string, game_package_name: string, page: number) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: '/cheatinfo/details',
        params: { 
            'from_date': from_date,
            'to_date': to_date,
            'country': country,
            'partner': partner,
            'game_package_name': game_package_name,
            'page': page
        },
        headers: {
        }
    };
    return axios(config);
};

// Hàm lấy Kafka metrics hàng ngày
const getKafkaDailyMessages = async (
    topic: string,
    start_ts: string,
    end_ts: string
  ): Promise<any> => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'grafana/kafka/metrics/dailymessages',
      params: {
        'Content-Type': 'application/json',
        topic_name: topic,
        start_ts: start_ts,
        end_ts: end_ts,
      },
      headers: { 
        'accept': 'application/json', 
        'Content-Type': 'application/json'
      },
    };
  
    return axios(config);
  };

const getSterStatus= async (page: number) => {
  let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'gaconfig/ster/status',
      params: { 
          'page': page
      },
      headers: {
      }
  };
  return axios(config);
};

const changeSterStatus = (game_id: number, new_status: boolean): Promise<any> => {
  const data = JSON.stringify({
    game_id: game_id,
    new_status: new_status,
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/gaconfig/ster/change',  
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    data: data,
  };

  return axios(config);
};


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
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
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
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    data: data,
  };

  return axios(config);
};

export { getCheatInfoOverview, getCheatInfoDetails, getKafkaDailyMessages, getSterStatus, changeSterStatus, QueryData, CalCoefficients, QueryCampaign};