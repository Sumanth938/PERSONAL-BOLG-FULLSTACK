import React, { useEffect, useState } from "react";
import "./AllArticles.css";
import PaginationComponent from "../../Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL_CONSTANT } from "../../../Utilities/constants";
import { fetchArticlesApiCall } from "../../../Services/GetAllArticles";
import store from "../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { authSelectors } from "../../../Store/Auth";
import Loader from "../../Loader/Loader";
import axios from "axios";
import { API_URL_CONSTANT } from "../../../Utilities/constants";

const dispatchStore = store.dispatch as
  | typeof store.dispatch
  | React.Dispatch<any>;

const AllArticles: React.FC = () => {
  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [authors, setAuthors] = useState<any>([]);
  const [currentAuthorId, setCurrentAuthorId] = useState("");

  const itemsPerPage = 5; // Set to 10 for pagination

  const {
    data: articles,
    loader,
    error,
    pagination,
  } = useSelector((state: any) => state.auth.articles);

  const navigate = useNavigate();

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Effect to fetch articles when the component mounts or when currentPage changes
  useEffect(() => {
    dispatchStore(
      fetchArticlesApiCall(currentPage, itemsPerPage, currentAuthorId)
    ); // Fetch data for the current page
  }, [currentAuthorId, currentPage]);

  console.log(currentAuthorId);

  // Update pagination state when pagination changes in Redux
  useEffect(() => {
    if (pagination) {
      setCurrentPage(pagination.current_page);
      setTotalPages(pagination.total_pages);
      setTotalItems(pagination.total_items);
    }
  }, [pagination]); // This will run when pagination data changes

  // Handle navigation to individual article view
  const handleNavigate = (id: any) => {
    const url = ROUTER_URL_CONSTANT.VIEW_ARTICLE + "/" + id;
    window.open(url, "_blank");
  };


  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get(API_URL_CONSTANT.GET_AUTHORS,
          {
            headers: {
              accept: "application/json",
            },
          }
        );
        if (response?.data?.data) {
          setAuthors(response.data.data); // Store unique authors in state
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchAuthors();
  }, []);

  //Login User Details
  const Fetch_Login_User = useSelector(authSelectors.getLoginUserState);
  const Login_User = Fetch_Login_User?.data?.data?.user_details;
  const loadingUserState = Fetch_Login_User?.loader;
  const errorUserState = Fetch_Login_User?.error;

  console.log(Login_User);
  const userId = Login_User?.id || null;

  if (loader) {
    <Loader />;
  }

  return (
    <div className="all-articles-layout">
      {/* <ul>
        {authors?.map((author: any) => (
          <li onClick={() => setCurrentAuthorId(author?.id)}>
            {author?.id}.{author?.author_name}
          </li>
        ))}
      </ul> */}
      <div className="heading-title text-center">
        <h2 className="title iq-tw-6">Welcome to Your Blogging Haven</h2>
        <p>
          Share your thoughts, discover inspiring articles, and connect with
          like-minded writers in a space designed for creativity and expression.
        </p>
      </div>
      <div className="article-section-layout">
        <div className="side-bar">
          <h6>Choose By Author</h6>
          {authors?.filter((author: any) => userId ? author?.id !== userId : true) .map((author: any) => (
            <div
              key={author?.id}
              className="d-flex align-items-center gap-1"
            >
              <input
                type="radio"
                name="author"
                value={Number(setCurrentAuthorId)}
                id={`author-${author?.id}`}
                checked={currentAuthorId === author?.id}
                onChange={(e) => setCurrentAuthorId(author.id)}
              />
              <label className="label" htmlFor={`author-${author.id}`}>
                {author.name}
              </label>
            </div>
          ))}
          {currentAuthorId && (
            <button onClick={() => setCurrentAuthorId("")} className="but color-white">Clear</button>
          )}
        </div>
        {articles?.filter((article: any) => userId ? article.owner_id !== userId : true).length === 0 ? (
          <p className="text-center">No Articles Found</p>
        ) : (
          <div className="articles-section w-100">
            {articles?.filter((article: any) => userId ? article.owner_id !== userId : true).map((article: any) => (
              <div key={article.id} className="article-card">
                <div className="d-flex flex-row align-items-center gap-2 justify-content-between">
                  <span className="article-title">{article.title}</span>

                  <button
                    className="small-but"
                    onClick={() => handleNavigate(article.id)}
                  >
                    View Article
                  </button>
                </div>
                <div className="d-flex flex-row align-items-center gap-2">
                  <span className="article-sub-title">
                    <strong>Author:</strong> {article.posted_by}
                  </span>
                  <span className="article-sub-title">
                    <strong>Date:</strong>{" "}
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>
                <span className="article-sub-title">{article.excerpt}</span>
              </div>
            ))}
            {articles?.length > 0 && (
              <div className="mt-5">
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllArticles;
