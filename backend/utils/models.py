from typing import Optional, List, Tuple
# from langchain_core.pydantic_v1 import BaseModel as BM, Field as F
from pydantic import BaseModel, Field


class UserQuestion(BaseModel):
    question: str
    image_links: Optional[List[str]] = None


class AIAnswer(BaseModel):
    question_content: str
    answer_content: str


class QuestionSolution(BaseModel):
    # question: str = Field(
    #     description='''
    #                 The question the user asked formatted into latex.
    #                 All mathematical symbols and equations MUST be formatted to latex.
    
    #                 No overly complex latex because this will be rendered in a browser not a latex document.
    #                 '''
    # )
    
    answer: str = Field(
        description='''
                    The answer to the question the user asked. Formated with latex.
                    It contains step by step VERY detailed instructions on how to solve the problem.
                    Each section must have it's own header (USE MARKDOWN FOR ALL FORMATTING THAT ISN"T MATHEMATICAL, SUCH AS HEADERS AND BOLDING TEXT), and a short note on what is being done or carried out in that section.
                    It also contains explicit workings on the solution to the problem.
                    All mathematical symbols and equations MUST be formatted to latex.
                    All latex must be contained within `$` or `$$` symbols, AND ADD COMPULSORILY, appropriate latex spacing using `\\;\\;` symbols, so as to be formatted properly on the webpage
    
                    No overly complex latex because this will be rendered in a browser not a latex document.
                    '''
    )


class ImageUpload(BaseModel):
    image_data: Tuple[str, bytes]


class CheckMathExpression(BaseModel):
    """Checks the given string if there is any math expression in it"""

    exist: bool = Field(description="Boolean yes or no value indicating whether or not the given string has a math expression in it.")
