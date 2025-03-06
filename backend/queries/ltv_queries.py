from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from configs.database import get_bigquery_db as get_secondary_db
from models import MktDashboard, LtvAppPermission, LtvAppGames
from sqlalchemy.sql import func, literal
from sqlalchemy.types import Float 
from sqlalchemy.sql.expression import literal


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


def query_campaign(from_date: str, to_date: str, package_name: str, country: str = None, source: str = None, db: Session = Depends(get_secondary_db)):
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


def query_permission(username: str, db: Session = Depends(get_secondary_db)):
    result = db.query(
            LtvAppPermission.username,
            LtvAppPermission.view_all,
            LtvAppPermission.game_package_name,
            LtvAppPermission.created_at
        ).filter(
            LtvAppPermission.username == username
        ).all()

    if not result:
        raise HTTPException(status_code=404, detail="No data found")

    return result


def query_games(view_all: bool, games_list: list[str], db: Session = Depends(get_secondary_db)):
    query = db.query(
        LtvAppGames.package_name,
        LtvAppGames.name,
        LtvAppGames.os
    )

    if not view_all:
        if not isinstance(games_list, list):
            games_list = [games_list]
        
        if games_list:
            query = query.filter(LtvAppGames.package_name.in_(games_list))

    result = query.all()

    if not result:
        raise HTTPException(status_code=404, detail="No data found")

    return result

