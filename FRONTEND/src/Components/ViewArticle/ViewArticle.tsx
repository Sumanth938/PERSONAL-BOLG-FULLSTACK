import React, { useEffect } from "react";
import "./ViewArticle.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticleByIdApiCall } from "../../Services/GetArticleById"; // Import the service function
import store from "../../Store/store";

interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
}

const dispatchStore = store.dispatch as typeof store.dispatch | React.Dispatch<any>;

const ViewArticle: React.FC = () => {
  const { data } = useParams<{ data: any }>();
  const article_id = Number(data);

  const dispatch = useDispatch();

  const { data: article, loader, error } = useSelector(
    (state: any) => state.auth.article
  );

  useEffect(() => {
    if (article_id) {
      dispatchStore(fetchArticleByIdApiCall(article_id)); // Dispatch action to fetch the article
    }
  }, [dispatchStore, article_id]);

  if (loader) return <p>Loading article...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!article) return <p>Article not found</p>;

  return (
    <div className="view-article-layout">
      <h1>{article.title}</h1>
      <div className="article-meta d-flex gap-3">
        <p>
          <strong>Author:</strong> {article.posted_by}
        </p>
        <p>
          <strong>Date:</strong> {new Date(article.created_date).toLocaleDateString()}
        </p>
      </div>
      <p className="article-excerpt">{article.excerpt}</p>
      <div className="article-content">
        <p>{article.content}</p>
      </div>
    </div>

  );
};

export default ViewArticle;
