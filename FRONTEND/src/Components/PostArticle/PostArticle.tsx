import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./Post.css";
import {postArticleAPICall} from "../../Services/PostArticle";
import store from "../../Store/store";

interface ArticleForm {
  title: string;
  author: string;
  content: string;
}

const dispatchStore = store.dispatch as
  | typeof store.dispatch
  | React.Dispatch<any>;

const PostArticle: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleForm>();
  const [submittedData, setSubmittedData] = useState<ArticleForm | null>(null);

  const onSubmit = (data: ArticleForm) => {
    setSubmittedData(data);
    console.log("Article Submitted:", data);
    dispatchStore(postArticleAPICall(data));
  };

  return (
    <div className="post-article-layout">
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="heading-font color-primary text-center">Post Article</p>
        <div className="form-post">
          <div className="input-layout">
            <label htmlFor="title">Title :</label>
            <input
              id="title"
              type="text"
              placeholder="Enter article title"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Title cannot exceed 100 characters",
                },
              })}
            />
            {errors.title && (
              <span className="error-message">{errors.title.message}</span>
            )}
          </div>

          {/* Content */}
          <div className="input-layout">
            <label htmlFor="content">Content :</label>
            <textarea
              id="content"
              placeholder="Write your article here..."
              rows={6}
              {...register("content", {
                required: "Content is required",
                minLength: {
                  value: 20,
                  message: "Content must be at least 20 characters long",
                },
              })}
            ></textarea>
            {errors.content && (
              <span className="error-message">{errors.content.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="but color-white">
            Submit Article
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostArticle;
