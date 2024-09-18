import os
from typing import List

from pydantic import UUID4

from dotenv import load_dotenv
from langchain_core.output_parsers.openai_tools import PydanticToolsParser
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.prompts import FewShotChatMessagePromptTemplate
from langchain.prompts import PromptTemplate
from langchain.prompts.few_shot import FewShotPromptTemplate
from langchain.schema import HumanMessage
from langchain.schema.runnable import RunnableSerializable
from langchain.schema.output_parser import StrOutputParser
from langchain_mongodb import MongoDBChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from .utils.load_examples import load_json
from utils.models import CheckMathExpression, UserQuestion, QuestionSolution

load_dotenv()

examples = load_json("./ai/examples.json")
tools = [CheckMathExpression]


def get_by_session_id(session_id: str):
    return MongoDBChatMessageHistory(
        connection_string='mongodb+srv://sdakarawak:<db_password>@cluster0.ccuz3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        session_id=session_id,
        database_name='chatHistory',
        collection_name='History'
    )


def get_ai_response(question: str, session_id: UUID4) -> str:
    chat_llm = (ChatOpenAI(
        model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=4096)
        .with_structured_output(QuestionSolution, strict=True)
    )
    example_prompt = PromptTemplate(
        input_variables=["question", "answer"], template="Question: {question}\n{answer}")

    few_shot_prompt = FewShotPromptTemplate(
        examples=examples,
        example_prompt=example_prompt,
        prefix="""
                Give the output in proper latex format only.\n \
                Make sure all final answers are evaluated if real values are available\n \
                All mathematics must be in latex
                {history}
                """,
        suffix="""
                Think carefully step by step when answering.\n
                Be as explicit as possible when solving the questions and give your answers in real numbers unless the question requires solution to be in terms of a variable.\n
                Question: Solve the following\n
                {input} and show steps
                """,
        input_variables=["history", "input"]
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", """
                        You are a world class STEM problem solver.
                        You provide clear, concise and highly detailed step by step solutions to problems you are asked to solve.
             
                        You are to return all solutions in latex with proper formatting.
                        Use only simple latex as the result will be rendered in a browser and not a latex document.
                        """),
            MessagesPlaceholder(variable_name='history'),
            few_shot_prompt,
            HumanMessage(
                content='{question}'
            )
        ]
    )

    chain = RunnableWithMessageHistory(
        prompt | chat_llm,
        get_by_session_id,
        input_messages_key='question',
        history_messages_key='history'
    )

    return chain.ainvoke(
        {'question': question},
        config={'configurable': {'session_id': session_id}}
    )


def create_format_ai() -> RunnableSerializable[dict, str]:
    # prompt = PromptTemplate(input_variables=['question'],
    # template="""Format the following to latex using only '$' AND NEVER USE '$$'\n{question}""")

    prompt = PromptTemplate.from_template("""Does the following question have a math expression in it:\n
    {question}""")
    llm = (ChatOpenAI(model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=500)
           .with_structured_output(QuestionSolution, strict=True)
    )
    # llm = OpenAI(model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=500)
    tool_llm = llm.bind_tools(tools)

    return prompt | tool_llm



def create_ai_with_image(image_urls: List[str]):
    messages = [
        {
            'type': 'text',
            'text': """
                        Think carefully step by step when answering. \n \
                        show explicitly and explain the steps involved in the solution
                        
                        Question: {input} """
        }
    ]

    messages += [{
        'type': 'image_url',
        'image_url': {
            'url': image_url
        }
    } for image_url in image_urls]

    chat_llm = ChatOpenAI(
        model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=4096)
    ex_prompt = ChatPromptTemplate.from_messages(
        [
            ('human', '{question}'),
            ('ai', '{answer}')
        ]
    )

    few_shot_prompt = FewShotChatMessagePromptTemplate(
        example_prompt=ex_prompt,
        examples=examples,
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", """
                        What is solution to the problem in the image?
                        Give the output in proper latex format only.\n \
                        Make sure all final answers are evaluated if real values are available\n \
                        All mathematics must be in latex. \n \
                        IF A GRAPH IS PROVIDED TO YOU, ENSURE THAT YOUR ANSWERS ARE DEPENDENT ON WHAT IS SHOWN IN THE GRAPH AND THE QUESTION IN THE IMAGE.  DO NOT ANSWER OFF TRACK \n \
                        If you do not know the solution to a problem, say so rather than attempting to solve it.
                        """),
            few_shot_prompt,
            HumanMessage(
                content=messages
            )
        ]
    )

    # buffer_memory_fs = ConversationSummaryBufferMemory(
    #     llm=chat_llm,
    #     max_token_limit=os.environ["MAX_NUM_TOKENS"],
    #     return_messages=True,
    # )
    #
    # ai_vision = ConversationChain(
    #     llm=chat_llm,
    #     memory=buffer_memory_fs,
    #     prompt=prompt
    # )

    return prompt | chat_llm
