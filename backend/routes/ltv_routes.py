from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from configs.database import get_bigquery_db as get_secondary_db
from schemas import DataInput, PermissionInput, GameInput
from utils.ltv import calculate_coefficients, calculate_runningsum_dnr
import math
from utils.auth import verify_token
from queries import query_data, query_campaign, query_permission, query_games
from time import sleep


router = APIRouter(
    prefix="/v1/ltv",
    tags=["ltv"],
)

@router.post("/calculate")
async def get_data(
    input_data: DataInput,
    db: Session = Depends(get_secondary_db)
):
    res = query_data(
        from_date=input_data.from_date,
        to_date=input_data.to_date,
        package_name=input_data.package_name,
        country=input_data.country if input_data.country else None,
        source=input_data.source if input_data.source else None,
        campaign_name=input_data.campaign_name if input_data.campaign_name else None,
        db=db
    )

    d1, d3, d7 = res.rrd1, res.rrd3, res.rrd7
    d30 = res.d30 if hasattr(res, "d30") else 0
    arpdau = res.arpdau
    actual_roas_7d = res.actual_roas_7d

    n1_values = [1, 3, 7] if d30 == 0 else [1, 3, 7, 30]
    r1_values = [d1, d3, d7] if d30 == 0 else [d1, d3, d7, d30]

    try:
        a1, b1 = calculate_coefficients(n_values=n1_values, r_values=r1_values)

        if math.isnan(a1) or math.isnan(b1) or math.isinf(a1) or math.isinf(b1):
            a1, b1 = 0.0, 0.0

        rs_dnr_df = calculate_runningsum_dnr(a1, b1)
        n2_values = [7, 14, 30]
        r2_values = [rs_dnr_df['rs_dnr'][v] for v in n2_values]

        a2, b2 = calculate_coefficients(n_values=n2_values, r_values=r2_values)

        return {
            "status_code": 200,
            "data": {
                "d1": d1,
                "d3": d3,
                "d7": d7,
                "a1": a1,
                "b1": b1,
                "a2": a2,
                "b2": b2,
                "arpdau": arpdau,
                "actual_roas_7d": actual_roas_7d
            }
        }
    except Exception as e:
        return {"error": str(e)}

@router.post("/calculate/coefficients")
def get_coefficients(obj: dict):
    if obj and '7' in obj.keys():
        n_values = [7, 14, 30]
        r_values = [
            obj['7'] / obj['7'] if obj['7'] != 0 else 0,
            obj['7'] / obj['14'] if obj.get('14', 1) != 0 else 0,
            obj['7'] / obj['30'] if obj.get('30', 1) != 0 else 0
        ]
        a, b = calculate_coefficients(n_values=n_values, r_values=r_values)
        actual_n = (obj['actual_roas_7d']/a) ** (1/b)
        return {"data": {
            "a": a,
            "b": b,
            "actual_n": actual_n
        }
        }

@router.post("/query/campaign")
async def get_campaign(input_data: DataInput, db: Session = Depends(get_secondary_db)
                    #    , token_payload: dict = Depends(verify_token)
                ):
    res = query_campaign(
        from_date=input_data.from_date,
        to_date=input_data.to_date,
        package_name=input_data.package_name,
        country=input_data.country if input_data.country else None,
        source=input_data.source if input_data.source else None,
        db=db
    )

    return {
        "data": res
    }

@router.post("/query/permission")
async def get_app_permission(input_data: PermissionInput, db: Session = Depends(get_secondary_db)):
    res = query_permission(username=input_data.username, db=db)

    # Sắp xếp theo created_at (mới nhất lên đầu)
    sorted_res = sorted(res, key=lambda x: x.created_at, reverse=True)

    games_list = []
    latest_view_all = None

    for row in sorted_res:
        view_all_flag = row.view_all  # Truy cập trực tiếp thuộc tính thay vì dict(row)
        game_package = row.game_package_name

        # Nếu gặp record view_all = False => Bắt đầu lưu danh sách game
        if view_all_flag is False:
            games_list.append(game_package)

        # Nếu gặp record view_all = True
        if view_all_flag is True:
            if games_list:
                # Nếu trước đó đã có game cụ thể (view_all=False), thì bỏ qua view_all=True
                continue  
            else:
                # Nếu chưa có game nào, thì giữ nguyên view_all=True
                latest_view_all = True
                break  

    return {
        "data": {
            "view_all": latest_view_all if not games_list else False,  
            "games_list": games_list if not latest_view_all else []
        }
    }

@router.post("/query/games")
async def get_games_list(input_data: GameInput, db: Session = Depends(get_secondary_db)
                    #    , token_payload: dict = Depends(verify_token)
                ):
    
    res = query_games(
        view_all=input_data.view_all,
        games_list=input_data.games_list,
        db=db
    )
    return {
        "data": res
    }