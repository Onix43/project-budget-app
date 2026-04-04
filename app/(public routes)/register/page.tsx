import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";

const schema = Yup.object({
    name: Yup.string()
        .min(2, "Min 2 characters")
        .max(32, "Max 32 characters")
        .required("Name is required"),
    email: Yup.string().email(),
    password: Yup.string()
        .min(8, "Min 8 characters")
        .max(64, "Max 64 characters"),
});

export default function SignUp(){
    return(
        <>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={schema}
            >
                <Form className={css.form}>
                    <div className={css.formGroup}>
                        <label htmlFor={`${id}-title`}>Title</label>
                        <Field
                            id={`${id}-title`}
                            type="text"
                            name="title"
                            className={css.input}
                        />
                        <ErrorMessage name="title" component="span" className={css.error} />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor={`${id}-content`}>Content</label>
                        <Field
                            as="textarea"
                            id={`${id}-content`}
                            name="content"
                            rows={8}
                            className={css.textarea}
                        />
                        <ErrorMessage component="span" name="content" className={css.error} />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor={`${id}-tag`}>Tag</label>
                        <Field as="select" id={`${id}-tag`} name="tag" className={css.select}>
                            {noteTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </Field>
                        <ErrorMessage component="span" name="tag" className={css.error} />
                    </div>

                    <div className={css.actions}>
                        <button type="button" className={css.cancelButton} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={css.submitButton}>
                            Create note
                        </button>
                    </div>
                </Form>
            </Formik>
        </>
    );
}