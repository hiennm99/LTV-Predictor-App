import numpy as np
import pandas as pd


def calculate_coefficients(n_values: list, r_values: list):
    n_values = np.array(n_values)
    r_values = np.array(r_values)

    log_n = np.log(n_values)
    log_r = np.log(r_values)

    coefficients = np.polyfit(log_n, log_r, 1)
    b = coefficients[0]
    log_a = coefficients[1]
    a = np.exp(log_a)

    return a, b

def calculate_runningsum_dnr(a, b):
    days_list = [x for x in range(0, 31)]
    df = pd.DataFrame(data={"n": days_list})

    # Thêm cột dnr với giá trị mặc định
    df["dnr"] = 0.0  
    for i in range(len(df)):
        if i == 0: 
            df.loc[i, "dnr"] = 1.0
        else:
            df.loc[i, "dnr"] = a * pow(df.loc[i, "n"], b) 

    df["rs_dnr"] = df["dnr"].cumsum()
    result_df = df[['n', 'rs_dnr']]
    return result_df