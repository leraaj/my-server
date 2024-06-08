import React from "react";
import useFetch from "../../../../hooks/useFetch";
import CustomButton from "../../../../components/button/CustomButton";

const Career = () => {
  const { data: jobs, loading: jobLoading } = useFetch(
    `${process.env.REACT_APP_API_URL}/api/jobs`
  );
  const { data: categories, loading: categoryLoading } = useFetch(
    `${process.env.REACT_APP_API_URL}/api/categories`
  );

  // Group jobs by category
  const categorizedJobs = categories?.reduce((acc, category) => {
    acc[category.title] =
      jobs?.filter((job) => job?.category?.title === category.title) || [];
    return acc;
  }, {});

  return (
    <div id="career" className="landing-section">
      <div className="col pt-5">
        <span className="bar-title" style={{ paddingBottom: "3rem" }}>
          we're hiring!
          <br />
          grab the opportunity
        </span>

        <div className="row mx-0">
          {categoryLoading || jobLoading ? (
            <span>Loading...</span>
          ) : (
            categories?.map((category, index) => (
              <div className="col-sm-12 col-md pb-4" key={index}>
                <h3 style={{ fontFamily: "Bayon" }}>{category.title}</h3>
                <ul className="m-0 p-0" style={{ listStyle: "none" }}>
                  {categorizedJobs[category.title]?.length > 0 ? (
                    categorizedJobs[category.title].map((job, jobIndex) => (
                      <li key={jobIndex}>• {job.title}</li>
                    ))
                  ) : (
                    <li>No jobs available</li>
                  )}
                </ul>
              </div>
            ))
          )}
        </div>
        <div className="col-12 p-2 d-flex justify-content-end">
          <button className="secondary-btn">Apply now</button>
        </div>
      </div>
    </div>
  );
};

export default Career;
