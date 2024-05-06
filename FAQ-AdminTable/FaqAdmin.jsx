import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import debug from "sabio-debug";
import * as faqFormService from "components/faq/faqFormServices";
import FaqTable from "./FaqTable";
import toastr from "toastr";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { Fade } from "react-bootstrap";
import FaqForm from "components/faq/FaqForm";

const _logger = debug.extend("work");

function FaqAdmin() {
  const [faqList, setFaqList] = useState({
    faqsList: [],
    faqsComponent: [],
  });

  const [modalShow, setModalShow] = useState(false);

  const [selectedFaq, setSelectedFaq] = useState( {
    id:"",
    question: "",
    answer: "",
    categoryId: "",
    sortOrder: "",
  });     

  const handleClose = () => {
    setModalShow(false);
    faqFormService.getAllFaq().then(onGetFaqsSuccess).catch(onGetFaqsError);
  };

  const handleModalDisplay = (faqObj) => {
    setSelectedFaq(faqObj);
    setModalShow(true);
  };

  useEffect(() => {
    faqFormService.getAllFaq().then(onGetFaqsSuccess).catch(onGetFaqsError);
    _logger("get faqs is working");
  }, []);

  const onGetFaqsSuccess = (data) => {
    _logger(data, "this is your data");
    let faq = data.items;
    setFaqList((preState) => {
      const newFaq = { ...preState };
      newFaq.faqsList = faq;
      newFaq.faqsComponent = faq.map(mapFaqs);
      return newFaq;
    });
  };
  const onGetFaqsError = (err) => {
    _logger(err, "this is an error");
    toastr.error("Error occurred when retrieving questions");
  };

  const mapFaqs = (aFaq) => {
    _logger("Here's single faq", aFaq);
    return (
      <FaqTable
        faq={aFaq}
        key={"ListA" + aFaq.id}
        onFaqClicked={onDeleteFaq}
        handleModalDisplay={handleModalDisplay}
      ></FaqTable>
    );
  };

  const onDeleteFaq = useCallback((aFaq) => {
    const handler = getFaqDeleteSuccess(aFaq.id);
    faqFormService.deleteFaq(aFaq.id).then(handler).catch(onDeleteFaqError);
  }, []);

  const getFaqDeleteSuccess = (idDeleted) => {
    toastr.success("Question was deleted");
    return () => {
      setFaqList((preState) => {
        const newFaq = { ...preState };
        newFaq.faqsList = [...newFaq.faqsList];
        const indexOf = newFaq.faqsList.findIndex((faq) => {
          let result = false;
          if (faq.id === idDeleted) {
            result = true;
          }
          return result;
        });
        if (indexOf >= 0) {
          newFaq.faqsList.splice(indexOf, 1);
          newFaq.faqsComponent = newFaq.faqsList.map(mapFaqs);
        }
        return newFaq;
      });
    };
  };

  const onDeleteFaqError = (err) => {
    _logger(err, "error occured when deleting from table");
    toastr.error("Error occured when trying to delete question");
  };

  const navigate = useNavigate();

  const addQuestionSubmit = () => {
    navigate(`/faq/add/`);
  };

  return (
    <React.Fragment>
      <div className="main-container">
        <section className="org-table-header">
          <h1> Frequently Asked Question </h1>
        </section>
        <div className="list-table-container">
          <Table className="table table-hover mt-3 shadow-lg">
            <thead>
              <tr className="bg-headers">
                <th className="table-list" scope="col">
                  Sort Order
                </th>
                <th className="table-header" scope="col">
                  Question
                </th>
                <th className="table-header" scope="col">
                  Answer
                </th>
                <th className="table-category" scope="col">
                  Category
                </th>
                <th className="table-category" scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="table-body">{faqList.faqsComponent}</tbody>
          </Table>
        </div>
        <button
          type="button"
          className="add-table-button btn-sm"
          onClick={addQuestionSubmit}
        >
          Add Question
        </button>
      </div>
      <Modal show={modalShow} onHide={handleClose} animation={Fade}>
        <Modal.Header closeButton className="modal-table"></Modal.Header>
        <Modal.Body className="modal-table">
          {selectedFaq && (
            <FaqForm faqData={selectedFaq} onSuccess={handleClose} />
          )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default FaqAdmin;
