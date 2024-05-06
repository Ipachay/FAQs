import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import debug from "sabio-debug";
import lookUpService from "services/lookUpService";
import { useState } from "react";
import { mapLookUpItem } from "helpers/utils";
import "./faqform.css";
import * as faqFormService from "./faqFormServices";
import FaqFormSchema from "./faqFormSchema";
import toastr from "toastr";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";



const _logger = debug.extend("work");

function FaqForm({ faqData, onSuccess }) {
  const FaqFormLayout = {
    question: "",
    answer: "",
    categoryId: "",
    sortOrder: "",
  };

  const [lookUps, setLookUps] = useState({
    categories: [],
    mappedCategories: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    lookUpService
      .LookUp(["FAQCategories"])
      .then(onLookUpSuccess)
      .catch(onLookUpError);
  }, []);

  const onLookUpSuccess = (data) => {
    _logger(data, "is getting data");
    let categories = data.item.faqCategories;
    setLookUps((preState) => {
      const newState = { ...preState };
      newState.categories = categories;
      newState.mappedCategories = categories.map(mapLookUpItem);
      return newState;
    });
  };

  const onLookUpError = (err) => {
    _logger(err, "Error occurred in Lookup service");
    toastr.error("Error occurred");
  };

  const handleSubmit = (values) => {
    if (faqData) {
      faqFormService
        .updateFaq(values, faqData.id)
        .then(onSuccessFaq)
        .catch(onErrorFaq);
    } else {
      faqFormService.addFaq(values).then(onSuccessAddFaq).catch(onErrorFaq);
    }
  };

  const onSuccessFaq = (response) => {
    toastr.success("FAQ update was successful`");
    _logger(response);
    onSuccess();
  };

  const onSuccessAddFaq = (response) => {
    toastr.success("FAQ submission was successful");
    _logger(response);
    navigate(`/faq/adminlist`);
  };

  const onErrorFaq = (err) => {
    _logger(err);
    toastr.error("Error occurred during FAQ submission");
  };

  const handleCancel = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/faq/adminlist");
    }
  };

  return (
    <React.Fragment>
      <div
        className="faq-form-card card"
        style={{ width: "40rem" }}
        id="fAQ-Form-card"
      >
        <h1 className="faq-form-header text-center"> Enter FAQ</h1>
        <div className="card-body">
          <Formik
            enableReinitialize={true}
            initialValues={faqData || FaqFormLayout}
            onSubmit={handleSubmit}
            validationSchema={FaqFormSchema}
          >
            <Form>
              <div className="faq-form-text">
                Question:
                <div className="form mb-2">
                  <Field
                    size="sm"
                    component="textarea"
                    name="question"
                    className="form-control faq-form-placeholder"
                    id="question"
                    placeholder="Enter your question here"
                  ></Field>
                </div>
                <label
                  htmlFor="floatingInputGroup1"
                  className="form-label"
                ></label>
                <ErrorMessage
                  name="question"
                  component="div"
                  className="faq-form-error has-error"
                />
              </div>
              <div className="faq-form-text">
                Answer:
                <div className="form mb-2">
                  <Field
                    size="sm"
                    component="textarea"
                    name="answer"
                    className="form-control  faq-form-placeholder"
                    id="answer"
                    placeholder="Enter your answer here"
                  ></Field>
                </div>
                <label htmlFor="InputAnswer" className="form-label"></label>
                <ErrorMessage
                  name="answer"
                  component="div"
                  className="faq-form-error has-error"
                />
              </div>
              <div className="faq-form-text">
                Category:
                <div className="form mb-2">
                  <Field
                    size="sm"
                    as="select"
                    name="categoryId"
                    className="form-control  faq-form-placeholder"
                    id="categoryId"
                  >
                    <option value="">Select a Category</option>
                    {lookUps.mappedCategories}
                  </Field>
                  <label htmlFor="InputCategory" className="form-label"></label>
                  <ErrorMessage
                    name="categoryId"
                    component="div"
                    className="faq-form-error has-error"
                  />
                </div>
              </div>
              <div className="faq-form-text">
                Sort Order:
                <div className="form mb-2">
                  <Field
                    size="sm"
                    type="text"
                    name="sortOrder"
                    className="form-control  faq-form-placeholder"
                    id="sortOrder"
                    placeholder="Enter Sort Order "
                  ></Field>
                  <label
                    htmlFor="exampleInputSortOrder"
                    className="form-label"
                  ></label>
                  <ErrorMessage
                    name="sortOrder"
                    component="div"
                    className="faq-form-error has-error"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="faq-form-button btn btn-secondary btn-sm"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="faq-form-button btn btn-secondary btn-sm"
                  onClick={() => handleCancel(true)}
                >
                  Cancel
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </React.Fragment>
  );
}

FaqForm.propTypes = {
  faqData: PropTypes.shape({
    answer: PropTypes.string.isRequired,
    categoryId: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    question: PropTypes.string.isRequired,
    sortOrder: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
  }),
  onSuccess: PropTypes.func.isRequired,
};

export default FaqForm;
