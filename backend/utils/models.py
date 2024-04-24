from typing import Optional, List, Tuple
from langchain_core.pydantic_v1 import BaseModel as BM, Field as F
from pydantic import BaseModel, Field


class UserQuestion(BaseModel):
    question: str
    image_links: Optional[List[str]] = None


class AIAnswer(BaseModel):
    question_content: str
    answer_content: str


class ImageUpload(BaseModel):
    image_data: Tuple[str, bytes]


class CheckMathExpression(BM):
    """Checks the given string if there is any math expression in it"""

    exist: bool = F(description="Boolean yes or no value indicating whether or not the given string has a math expression in it.")
