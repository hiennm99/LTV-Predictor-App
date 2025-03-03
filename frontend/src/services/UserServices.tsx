import axios from './CustomizedAxios';

const SigninApi = (email: string, password: string): Promise<any> => {
  const data = JSON.stringify({
    email: email,
    password: password,
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/auth/login',
    data: data,
  };

  return axios(config);
};

const SignupApi = (first_name: string, last_name: string, email: string, password: string, department: string): Promise<any> => {
  const data = JSON.stringify({
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: password,
    department: department,
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/auth/register',  
    data: data,
  };

  return axios(config);
};

const GoogleSignInApi = async (id_token: string) => {
  const data = JSON.stringify({ 
    token: id_token 
  });
  const config = {
    method: "post",
    url: "/auth/google",
    data: data,
  };

  return axios(config);
}

export { SigninApi, SignupApi, GoogleSignInApi };
