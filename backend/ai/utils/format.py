from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.schema.output_parser import StrOutputParser
from utils.models import UserQuestion, QuestionSolution
import os
from pydantic import BaseModel, Field

def format_response(ai_response: str) -> str:
    # if '.\n' not in ai_response or ':\n' not in ai_response:
    return ai_response.replace(". ", ".\n").replace(": ", ":\n")

    # return ai_response


def format_prompt(prompt: str) -> str:
    pass


class QuestionSolution(BaseModel):
    question: str = Field(
        description='''
                    The question the user asked formatted into latex.
                    All mathematical symbols and equations MUST be formatted to latex.
    
                    No overly complex latex because this will be rendered in a browser not a latex document.
                    '''
    )
    
    answer: str = Field(
        description='''
                    The solution to the question the user asked formatted into latex.
                    It contains step by step VERY detailed instructions on how to solve the problem.
                    It also contains explicit workings on the solution to the problem.
                    All mathematical symbols and equations MUST be formatted to latex.
    
                    No overly complex latex because this will be rendered in a browser not a latex document.
                    '''
    )


async def format_question(question: UserQuestion) -> str:
    format_ai = (
        ChatOpenAI(model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=500)
        .with_structured_output(QuestionSolution, strict=True)
    )
    template = """
                    Change the math text in the question I'm about to give you to latex and return the entire sentence with it.\n
                    If you're not sure whether something is math text or not, DO NOT touch it.\n
                    
                    If there is no math text in the sentence, return only the question you were given without modification.
                    ONLY FORMAT THE MATHEMATICAL FUNCTIONS IN THE TEXT. DO NOT TOUCH ANY PURE TEXT. ALSO ADD NEW LINE CHARACTERS WHERE APPROPRIATE.\n\n
                    {question}
                    """

    prompt = PromptTemplate(input_variables=["question"], template=template)
    chain = prompt | format_ai
    formatted_question: QuestionSolution = await chain.ainvoke({'question': question.question})

    return formatted_question.question
