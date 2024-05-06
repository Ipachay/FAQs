import * as Yup from "yup";

const FaqSchema = Yup.object().shape({
  question: Yup.string().min(2).max(255).required("Question required"),
  answer: Yup.string().min(2).max(2000).required("Answer required"),
  categoryId: Yup.number().required("Category required"),
  sortOrder: Yup.number().required("Sort Order required"),
});

export default FaqSchema;