from sqlalchemy import Column, String, Date, Integer, Boolean, DateTime
from models.base_model import Base
from typing import Optional

class MktDashboard(Base):
    CustomTableName = "mkt_dashboard" 
    event_date = Column(Date)
    retained_users_1d = Column(Integer)
    retained_users_3d = Column(Integer)
    retained_users_7d = Column(Integer)
    tracker_installs = Column(Integer)
    total_revenue_actual = Column(Integer)
    total_revenue_7d = Column(Integer)
    adn_cost = Column(Integer)
    daily_active_users = Column(Integer)
    package_name = Column(String)
    country = Column(String)
    source = Column(String)
    campaign_name = Column(String)


class LtvAppPermission(Base):
    CustomTableName = "ltv_app_permission" 
    username = Column(String)
    game_package_name = Column(String)
    view_all = Column(Boolean)
    created_at = Column(DateTime)


class LtvAppGames(Base):
    CustomTableName = "ltv_games" 
    package_name = Column(String)
    name = Column(String)
    os = Column(String)