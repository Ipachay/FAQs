import React from "react";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import "./faqtable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenSquare } from "@fortawesome/free-solid-svg-icons";

const _logger = debug.extend("work");

function FaqTable( props) {
  const { faq, handleModalDisplay } = props;
  _logger(faq, "THESE ARE YOUR PROPS afaq");

  const onLocalDeleteClick = (e) => {
    e.preventDefault();
    props.onFaqClicked(faq);
  };

  const onEditFaqClick = () => {
    handleModalDisplay(faq)
  };


  return (
    <tr className="list-bg-headers .row-target">
       <td>{faq.sortOrder}</td>
      <td>{faq.question}</td>
      <td>{faq.answer}</td>
      <td className="text-center">{faq.categoryId.name}</td>
      <td className="text-end">
        <div className="button-container">
        <FontAwesomeIcon
           icon={faPenSquare}
          type="button"
          className="list-table-btn p-3 me-2"
          onClick={onEditFaqClick}
        />
        <FontAwesomeIcon
          icon={faTrash}
          type="button"
          className="list-table-btn p-3"
          onClick={onLocalDeleteClick}
        />
        </div>
      </td>
    </tr>
  );
}

FaqTable.propTypes = {   
      faq: PropTypes.shape({
        answer: PropTypes.string.isRequired,
        categoryId: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }),
        question: PropTypes.string.isRequired,
        sortOrder: PropTypes.number.isRequired,
      }),
  onFaqClicked: PropTypes.func.isRequired,
  handleModalDisplay: PropTypes.func.isRequired,
};

export default FaqTable;
