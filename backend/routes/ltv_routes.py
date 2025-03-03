from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from configs.database import get_db, get_bigquery_db as get_secondary_db
from models import MktDashboard
from schemas.ltv_schemas import DataInput
from sqlalchemy.sql import func, literal
from sqlalchemy.types import Float 
from sqlalchemy.sql.expression import literal
from utils.ltv import calculate_coefficients, calculate_runningsum_dnr
import math
from utils.auth import verify_token


# Tạo router cho auth
router = APIRouter(
    prefix="/api/v1/ltv",
    tags=["ltv"],
)

def query_data(from_date: str, to_date: str, package_name: str, country: str = None, source: str = None, campaign_name: str = None, db: Session = Depends(get_secondary_db)):
    query = db.query(
        MktDashboard.event_date,
        (func.sum(MktDashboard.retained_users_1d) / func.sum(MktDashboard.tracker_installs)).label("rrd1"),
        (func.sum(MktDashboard.retained_users_3d) / func.sum(MktDashboard.tracker_installs)).label("rrd3"),
        (func.sum(MktDashboard.retained_users_7d) / func.sum(MktDashboard.tracker_installs)).label("rrd7"),
        (func.sum(MktDashboard.total_revenue_actual) / func.sum(MktDashboard.daily_active_users)).label("arpdau"),
        (func.sum(MktDashboard.total_revenue_7d) / func.sum(MktDashboard.adn_cost)).label("actual_roas_7d")
    ).filter(
        MktDashboard.event_date >= from_date,
        MktDashboard.event_date <= to_date,
        MktDashboard.package_name == package_name
    )

    if country:
        query = query.filter(MktDashboard.country == country)

    if source:
        query = query.filter(MktDashboard.source == source)

    if campaign_name:
        query = query.filter(MktDashboard.campaign_name == campaign_name)

    cte = query.group_by(MktDashboard.event_date).subquery("cte")

    result = db.query(
        func.avg(cte.c.rrd1).label("rrd1"),
        func.avg(cte.c.rrd3).label("rrd3"),
        func.avg(cte.c.rrd7).label("rrd7"),
        func.json_extract_scalar(
            func.to_json_string(func.approx_quantiles(cte.c.arpdau, 100)),
            literal("$[50]")
        ).cast(Float).label("arpdau"),  # Convert thành FLOAT
        func.avg(cte.c.actual_roas_7d).label("actual_roas_7d")
    ).all()


    if not result or not result[0]:
        raise HTTPException(status_code=404, detail="No data found")

    return result[0]


def query_campain(from_date: str, to_date: str, package_name: str, country: str = None, source: str = None, db: Session = Depends(get_secondary_db)):
    query = db.query(
        MktDashboard.campaign_name
    ).filter(
        MktDashboard.event_date >= from_date,
        MktDashboard.event_date <= to_date,
        MktDashboard.package_name == package_name
    )

    if country:
        query = query.filter(MktDashboard.country == country)

    if source:
        query = query.filter(MktDashboard.source == source)

    query = query.group_by(MktDashboard.campaign_name)  

    result = query.all()

    if not result:
        raise HTTPException(status_code=404, detail="No data found")

    return [row[0] for row in result]


@router.post("/calculate")
async def get_data(
    input_data: DataInput,
    db: Session = Depends(get_secondary_db),
    token_payload: dict = Depends(verify_token)
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
def get_coefficients(obj: dict, token_payload: dict = Depends(verify_token)):
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
async def get_campaign(input_data: DataInput, db: Session = Depends(get_secondary_db), token_payload: dict = Depends(verify_token)):
    res = query_campain(
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