import os
from typing import List

from dotenv import load_dotenv
from langchain_core.output_parsers.openai_tools import PydanticToolsParser
from langchain.chains import ConversationChain
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationSummaryBufferMemory
from langchain.prompts import ChatPromptTemplate
from langchain.prompts import FewShotChatMessagePromptTemplate
from langchain.prompts import PromptTemplate
from langchain.prompts.few_shot import FewShotPromptTemplate
from langchain.schema import HumanMessage
from langchain.schema.runnable import RunnableSerializable
from langchain.schema.output_parser import StrOutputParser
from .utils.load_examples import load_json
from utils.models import CheckMathExpression, UserQuestion

load_dotenv()

examples = load_json("./ai/examples.json")
tools = [CheckMathExpression]



def create_ai() -> ConversationChain:
    chat_llm = ChatOpenAI(
        model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=4096)
    example_prompt = PromptTemplate(
        input_variables=["question", "answer"], template="Question: {question}\n{answer}")

    prompt = FewShotPromptTemplate(
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

    buffer_memory_fs = ConversationSummaryBufferMemory(
        llm=chat_llm,
        max_token_limit=os.environ["MAX_NUM_TOKENS"],
        return_messages=True,
    )

    ai_fs = ConversationChain(
        llm=chat_llm,
        memory=buffer_memory_fs,
        prompt=prompt
    )

    return ai_fs


def create_format_ai() -> RunnableSerializable[dict, str]:
    # prompt = PromptTemplate(input_variables=['question'],
    # template="""Format the following to latex using only '$' AND NEVER USE '$$'\n{question}""")

    prompt = PromptTemplate.from_template("""Does the following question have a math expression in it:\n
    {question}""")
    llm = ChatOpenAI(model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=500)
    # llm = OpenAI(model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=500)
    tool_llm = llm.bind_tools(tools)

    return prompt | tool_llm


# def format_question(question: UserQuestion):
#     ai = create_format_ai()
#     formatted_question = ai.invoke({"question": question.question})
    
#     exist: bool = formatted_question.tool_calls[0]['args']['exist']

#     if exist:
#         prompt = PromptTemplate.from_template("""
#                                             Give me back this question formatted to latex using only '$' AND NEVER USE '$$' around ONLY math expressions.\n
#                                             DO NOT ATTEMPT THE QUESTION.\n
                                              
#                                             Question: {question}
#                                                 """)
#         chain = prompt | ChatOpenAI(model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=500) | StrOutputParser()

#         return chain.invoke({"question": question.question})
    
#     return question.question



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
