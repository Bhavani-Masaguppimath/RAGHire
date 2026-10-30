from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class RecommendationOut(BaseModel):
    id: str
    user_id: str
    title: str
    category: str
    topic: str
    priority: str
    reason: str
    suggested_action: str
    resource_link: Optional[str] = None
    is_completed: bool
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class RecommendationUpdate(BaseModel):
    is_completed: bool
