import os
from typing import List

from pydantic import UUID4, BaseModel, Field

from dotenv import load_dotenv
from langchain_core.output_parsers.openai_tools import PydanticToolsParser
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.prompts import FewShotChatMessagePromptTemplate
# from langchain.schema import HumanMessage
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import BaseMessage, AIMessage, HumanMessage

from langchain_core.runnables.history import RunnableWithMessageHistory

from .utils.load_examples import load_json
from utils.models import CheckMathExpression, QuestionSolution

load_dotenv()

examples = load_json("./ai/examples.json")
tools = [CheckMathExpression]

class InMemoryHistory(BaseChatMessageHistory, BaseModel):
    """In memory implementation of chat message history"""
    messages: List[BaseMessage] = Field(default_factory=list)

    def add_messages(self, messages: List[BaseMessage]):
        self.messages.extend(messages)

    def clear(self) -> None:
        self.messages = []


store = {}

def get_by_session_id(session_id: str) -> InMemoryHistory:
    if session_id not in store:
        store[session_id] = InMemoryHistory()
    return store[session_id]


async def get_ai_response(question: str, session_id: UUID4) -> QuestionSolution:
    chat_llm = (ChatOpenAI(
        model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=4096)
        .with_structured_output(QuestionSolution, strict=True)
    )
    example_prompt = ChatPromptTemplate.from_messages(
        [
            ('human', '{question}'),
            ('ai', '{answer}')
        ]
    )
    few_shot_prompt = FewShotChatMessagePromptTemplate(
        examples=examples,
        example_prompt=example_prompt,
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", """
                        You are a world class STEM problem solver.
                        You provide clear, concise and highly detailed step by step solutions to questions you are asked to solve.
             
                        Only solve the question that is provided to you by the user and nothing else.s
             
                        You are to return all solutions in latex with proper formatting.
                        Use only simple latex as the result will be rendered in a browser and not a latex document.
                        """),
            MessagesPlaceholder(variable_name='history'),
            # few_shot_prompt,
            (
                'human', '{question}'
            )
        ]
    )

    chain = RunnableWithMessageHistory(
        (prompt | chat_llm),
        get_by_session_id,
        input_messages_key='question',
        history_messages_key='history'
    )

    # print(store)
    _history = [HumanMessage(content=question)]
    history = get_by_session_id(session_id)

    

    response: QuestionSolution = chain.invoke(
        {'question': question, 'history': history},
        config={'configurable': {'session_id': session_id}}
    )

    _history.extend([AIMessage(content=response.answer)])

    history.add_messages(_history)

    return response


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
