from fastapi import BackgroundTasks,APIRouter,Depends,status, Request,HTTPException,Form,status,File,UploadFile
from sqlalchemy.orm import session
from fastapi import FastAPI,Depends,status,HTTPException,Query
from sqlalchemy.orm import session
from pydantic import BaseModel,Field, ValidationError
from fastapi.responses import JSONResponse,StreamingResponse
from pydantic import BaseModel

#models impors
from models.users import  User
from models.articles import Articles
from  models import Session

#single imports
import os,pytz,logging,io
from typing import List,Optional,Annotated
from datetime import datetime,date

#other imports
from .auth  import get_current_user
import utilities.logger as Logger
from routers.auth import get_password_hash,get_current_username

class ArticleRequest(BaseModel):
    title: str = Field(..., min_length=5, max_length=100, description="The title of the task")
    content: str = Field(..., min_length=10, max_length=500, description="The description of the task")

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Complete Documentation",
                "content": "Finalize and submit the project documentation for review."
            }
        }

error_logger = Logger.get_logger('error', logging.ERROR)
info_logger = Logger.get_logger('info', logging.INFO)

# models.Base.metadata.create_all(bind=engine)


router = APIRouter(
    prefix="/articles",
    tags=["Articles"],
    responses={401: {"user": "Not authorized"}}
)

def get_db():
    try:
        db = Session()
        yield db
    finally:
        db.close()

def get_user_fullname_by_id(id):
    try:
        session = Session()
        query = session.query(User).filter(User.is_active == True,User.id == id).first()
        if query:
            return query.name 
        return None
    finally:
        if session:
            session.close()

@router.get("/")
async def get_all_articles(sort_by: Optional[int] = None,page: Optional[int] = 1, size: Optional[int] = 20,user_id:Optional[int]=None,logined_user_id:Optional[int]=None):
    """
    Retrieve all active articles with optional sorting and pagination.

    Parameters:
    ----------
    sort_by : Optional[int] - Sort articles by ID (1 for ascending, 2 for descending). Defaults to None.\n
    page : Optional[int] - The page number to retrieve. Defaults to 1.\n
    size : Optional[int]- Number of articles per page. Defaults to 20.\n

    Returns:
    -------
    JSONResponse - A JSON response containing articledata, status, and pagination details.
    """
    session = None
    try:
        session = Session()

        page = page - 1

        query = session.query(Articles).filter(Articles.is_active == True)

        if user_id:
            query=query.filter(Articles.owner_id == user_id)
        
        if logined_user_id:
            query=query.filter(Articles.owner_id != logined_user_id)

        if sort_by:
            if sort_by != 1 and sort_by != 2:
                return JSONResponse({"detail":"SORT BY MUST EITHER 1 OR 2"},status_code=403)

        if sort_by:
            if sort_by == 1:
                query = query.order_by(Articles.id.asc())
            elif sort_by == 2:
                query = query.order_by(Articles.id.desc())

        # Get total number of items
        total_items = query.count()

        # Calculate total pages
        total_pages = (total_items + size - 1) // size

        query = query.offset(page*size).limit(size).all()
        
        # Format response to include the user's name
        articles_data = [
            {
                "id": article.id,
                "title": article.title,
                "content": article.content,
                "posted_by": get_user_fullname_by_id(article.owner_id),
                "created_at": article.created_date,
                "updated_at": article.modified_date,
                "created_by":article.created_by,
                "owner_id":article.owner_id
            }
            for article in query
        ]
        
        response = {
            "message": "SUCCESSFUL",
            "data": articles_data,
            "status": 200,
            "pagination": {
                "current_page": page + 1,
                "items_per_page": size,
                "total_pages": total_pages,
                "total_items": total_items
            }
        }

        info_logger.info("Successfully fetched all articles data  from database")
        return response
    except Exception as error:
        error_logger.exception(f"Error occurred in /GET_articles/ API.Error:{error}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(error))

    finally:
        if session:
            session.close()

@router.get("/authors")
async def get_all_authors():
    """
    Retrieve all distinct authors who own articles with their IDs.

    Returns:
    -------
    JSONResponse - A JSON response containing authors' data.
    """
    session = None
    try:
        session = Session()

        # Fetch all distinct authors (users) who have articles
        authors = (
            session.query(User.id, User.name)
            .join(Articles, Articles.owner_id == User.id)
            .filter(Articles.is_active == True,User.is_active == True)
            .distinct()
            .all()
        )

        # Format the response
        authors_data = [{"id": author.id, "name": author.name} for author in authors]

        return {
            "message": "SUCCESSFUL",
            "data": authors_data,
            "status": 200,
        }
    except Exception as error:
        raise HTTPException(
            status_code=500, detail=f"Error occurred while fetching authors: {str(error)}"
        )
    finally:
        if session:
            session.close()

@router.get("/user_articles")
async def user_articles(page: Optional[int] = 1, size: Optional[int] = 20,user: dict = Depends(get_current_user)):
    """
    Retrieve all active articles of logined user with optional  pagination.

    Parameters:
    ----------
    page : Optional[int] - The page number to retrieve. Defaults to 1.\n
    size : Optional[int]- Number of articles per page. Defaults to 20.\n

    Returns:
    -------
    JSONResponse - A JSON response containing articledata, status, and pagination details.
    """
    session = None
    try:
        session = Session()

        page = page - 1

        if not user:
            return {"message":"USER NOT FOUND", "status":status.HTTP_404_NOT_FOUND }
            
        query = session.query(Articles).filter(Articles.is_active == True,Articles.owner_id == user.get('user_id'))

        # if sort_by:
        #     if sort_by != 1 and sort_by != 2:
        #         return JSONResponse({"detail":"SORT BY MUST EITHER 1 OR 2"},status_code=403)

        # Get total number of items
        total_items = query.count()

        # Calculate total pages
        total_pages = (total_items + size - 1) // size

        query = query.offset(page*size).limit(size).all()
        
        response = {
            "message": "SUCCESSFUL",
            "data":  query,
            "status": 200,
            "pagination": {
                "current_page": page + 1,
                "items_per_page": size,
                "total_pages": total_pages,
                "total_items": total_items
            }
        }

        info_logger.info("Successfully fetched all articles data  from database")
        return response
    except Exception as error:
        error_logger.exception(f"Error occurred in /GET_user_articles/ API.Error:{error}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(error))

    finally:
        if session:
            session.close()

@router.get("/{id}")
def get_article_by_id(id):
    """
    Retrieve a specific articleby its ID if it is active.

    Parameters:
    ----------
    id : int - The ID of the article to retrieve.\n

    Returns:
    -------
    dict -  A dictionary containing the article details if found, along with a success message and status code.\n
    JSONResponse - A JSON response with an error message and a 404 status code if the article is not found.
    """
    session = None
    try:
        session = Session()
        article = session.query(Articles).filter(Articles.is_active == True,Articles.id == id).first()

        if article:
            info_logger.info("Sucessfully fetched article details sucessfully")
            article_data = {
                "id": article.id,
                "title": article.title,
                "content": article.content,
                "posted_by": get_user_fullname_by_id(article.owner_id),
                "created_date": article.created_date,
                "updated_at": article.modified_date,
                "created_by":article.created_by
            }
            return {"message": "SUCCESSFUL","data":article_data,"status_code":200}
        
        return JSONResponse({"detail": "INVALID ID,ARTICLE NOT FOUND"}, status_code=404)
    except Exception as error:
        error_logger.exception(f"Error occurred in /GET_articles_id/ API.Error:{error}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(error))
    finally:
        if session:
            session.close()

@router.post("/")
def create_new_task(request:ArticleRequest,user: dict = Depends(get_current_user)):
    """
    Creates a new article in the system for the authenticated user,returns a 201 response with a success message.\n

    Parameters:
    - request (ArticleRequest): The article details (title, content).\n
    - user (dict, optional): The authenticated user, injected by `Depends(get_current_user)`.\n

    Returns:
    - JSONResponse: A JSON response with a success or error message and an HTTP status code:
        - HTTP 201 if the article is successfully created.\n
        - HTTP 404 if the user is not found.\n
        - HTTP 500 if an internal error occurs.\n
    """
    session = None
    try:
        session = Session()
        article = session.query(Articles).filter(Articles.is_active == True).first()

        if not user:
            return {"message":"USER NOT FOUND", "status":status.HTTP_404_NOT_FOUND }
        
        info_logger.info(f"user with email {user.get('email')} has accessed the /POST_create_new_article API")

        article =Articles(
            title = request.title,
            content = request.content,
            created_by = user.get("email"),
            owner_id = user.get("user_id"),
        )

        session.add(article)
        session.commit()

        info_logger.info(f"User sucessfulyy created a new article ID:{article.id}")
        return JSONResponse({"detail":"USER SUCESSFULLY CREATED NEW ARTICLE"},status_code=201)
    
    except Exception as error:
        error_logger.exception(f"Error occurred in /POST_create_new_article API.Error:{error}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(error))
    finally:
        if session:
            session.close()

@router.put("/{id}", response_model=dict)
def update_article(id: int, request: ArticleRequest, user: dict = Depends(get_current_user)):
    """
    Updates an existing article for the authenticated user.\n

    Validates if the article exists, is owned by the user.
    Updates the article's title, and content, then returns a success response.
    If any validation fails, appropriate error responses are returned.

    Parameters:
    - id (int): The ID of the article to be updated.\n
    - request (ArticleRequest): The updated article details (title, content).\n
    - user (dict): The authenticated user, injected by `Depends(get_current_user)`.\n

    Returns:
    - JSONResponse: A JSON response with a success or error message and an HTTP status code:\n
        - HTTP 200 if the article is successfully updated.\n
        - HTTP 400 if the article is already marked as "completed".\n
        - HTTP 404 if the article is not found or the user does not own it.\n
        - HTTP 500 if an internal error occurs.
    """
    session = None
    try:
        session = Session()

        # Check if user exists
        if not user:
            return {"message": "USER NOT FOUND", "status": status.HTTP_404_NOT_FOUND}

        info_logger.info(f"user with email {user.get('email')} is accessing the /PUT_update_article API for article ID {id}")

        # Find the article by ID and ownership
        article = session.query(Articles).filter(Articles.id == id, Articles.owner_id == user.get("user_id"), Articles.is_active == True).first()

        if not article:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="article not found")

        # Update article fields
        article.title = request.title
        article.content = request.content
        article.modified_by = user.get("email")

        session.commit()

        info_logger.info(f"User successfully updated article ID: {id}")
        return JSONResponse({"detail": "ARTICLE SUCCESSFULLY UPDATED"}, status_code=200)

    except Exception as exc:
        error_logger.exception(f"Error occurred in /PUT_update_article API. Error: {exc}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))

    finally:
        if session:
            session.close()

@router.delete("/{id}")
def delete_task_by_id(id,user: dict = Depends(get_current_user)):
    """
    Delete a specific article by ID if the user is the owner.

    Parameters:
    ----------
    id : int\n
        The ID of the article to delete.
    user : dict
        The current user (retrieved from authentication).

    Returns:
    -------
    JSONResponse\n
        A success or error message based on the result.
    """
    session = None
    try:
        session = Session()
        article = session.query(Articles).filter(Articles.is_active == True,Articles.id == id).first()

        if not user:
            return {"message":"user not found", "status":status.HTTP_404_NOT_FOUND }
        
        if not article:
            return JSONResponse({"detail": "INVALID ID,ARTICLE NOT FOUND"}, status_code=404)
        
        info_logger.info(f"user with email {user.get('email')} has accessed the /DELETE_article_by_id API")

        if article.owner_id != user.get("user_id"):
            return JSONResponse({"detail":"YOU CANNOT DELETE THIS ARTICLE,YOUR NOT OWNER OF THIS ARTICLE"},status_code=403)
        
        article.is_active = False
        session.commit()

        info_logger.info(f"User Sucessfully deleted the article ID:{id}")
        return JSONResponse({"detail": "USER SUCCESSFULY DELETED THE ARTICLE"},status_code=200)
        
        
    except Exception as error:
        error_logger.exception(f"Error occurred in /DELETE_article_by_id/ API.Error:{error}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(error))
    finally:
        if session:
            session.close()